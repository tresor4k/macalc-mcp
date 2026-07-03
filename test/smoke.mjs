#!/usr/bin/env node
/**
 * Smoke test for the macalc-mcp stdio wrapper.
 *
 * Offline part (always runs): spawns the wrapper over stdio, initializes,
 * lists tools and checks the curated core profile (15 tools, schemas present).
 * Online part (skipped if the hosted endpoint is unreachable): calls two
 * calculators through the wrapper, including one via call_any_calculator,
 * and checks known-good reference values.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(__dirname, "..", "src", "index.js");

let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const client = new Client({ name: "macalc-mcp-smoke", version: "1.0.0" }, { capabilities: {} });
const transport = new StdioClientTransport({ command: process.execPath, args: [SERVER] });
await client.connect(transport);

// --- Offline checks: curated core profile ---
const { tools } = await client.listTools();
check("core profile exposes 15 tools", tools.length === 15, `got ${tools.length}`);
const names = tools.map((t) => t.name);
for (const expected of [
  "calculate_french_income_tax",
  "calculate_us_federal_tax",
  "calculate_mortgage",
  "list_bundles",
  "get_bundle_tools",
  "call_any_calculator",
]) {
  check(`tool present: ${expected}`, names.includes(expected));
}
check(
  "every tool has description + inputSchema",
  tools.every((t) => typeof t.description === "string" && t.description.length > 50 && t.inputSchema?.type === "object")
);
check(
  "every tool declares readOnlyHint annotation",
  tools.every((t) => t.annotations?.readOnlyHint === true)
);

// --- Online checks (best effort — skip cleanly when offline) ---
let online = true;
try {
  const res = await client.callTool({
    name: "calculate_mortgage",
    arguments: { principal: 200000, annual_rate: 3.5, years: 20 },
  });
  const data = JSON.parse(res.content?.[0]?.text ?? "{}");
  const monthly = data?.result?.monthly_payment;
  // PMT(200000, 3.5%/12, 240) = 1159.92
  check("calculate_mortgage 200k/3.5%/20y ≈ 1159.92/mo", Math.abs(monthly - 1159.92) < 1, `got ${monthly}`);
} catch (err) {
  online = false;
  console.log(`SKIP  online checks (endpoint unreachable: ${err?.message?.slice(0, 80)})`);
}

if (online) {
  try {
    const res = await client.callTool({
      name: "call_any_calculator",
      arguments: { tool_name: "calculate_bmi", arguments: { weight_kg: 70, height_cm: 175 } },
    });
    const data = JSON.parse(res.content?.[0]?.text ?? "{}");
    const bmi = data?.result?.bmi ?? data?.result?.value ?? data?.result;
    const bmiNum = typeof bmi === "number" ? bmi : bmi?.bmi;
    // 70 / 1.75² = 22.86
    check("call_any_calculator → calculate_bmi 70kg/175cm ≈ 22.86", Math.abs(Number(bmiNum) - 22.86) < 0.1, `got ${JSON.stringify(bmi).slice(0, 60)}`);

    const bad = await client.callTool({
      name: "call_any_calculator",
      arguments: {},
    });
    check("call_any_calculator without tool_name returns isError", bad.isError === true);
  } catch (err) {
    check("online dispatcher checks", false, err?.message);
  }
}

await client.close();
if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log("\nAll smoke checks passed");
process.exit(0);
