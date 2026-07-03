#!/usr/bin/env node
/**
 * macalc-mcp — stdio wrapper around the hosted macalc Streamable HTTP MCP server.
 *
 * Lets MCP clients that only support stdio (some Claude Desktop setups,
 * older Cursor builds, sandboxed CI environments) reach the hosted endpoint
 * at https://macalculatriceenligne.com/api/mcp without any API key.
 *
 * Default profile (v0.4.0): a curated CORE set of 15 well-scoped tools —
 * 12 flagship calculators + list_bundles / get_bundle_tools for discovery +
 * call_any_calculator to invoke any of the 446 hosted calculators by name.
 * Set MACALC_MCP_FULL=1 to expose the full remote catalog instead.
 *
 * Design: lazy connect on first request, cached client, graceful degradation
 * if the remote is temporarily unavailable. tools/call, prompts and resources
 * are always forwarded transparently.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { CORE_TOOLS } from "./core-tools.js";

const REMOTE_URL =
  process.env.MACALC_MCP_URL || "https://macalculatriceenligne.com/api/mcp";
const FULL_CATALOG = process.env.MACALC_MCP_FULL === "1";

const SERVER_INFO = {
  name: "macalc-mcp",
  version: "0.4.0",
};

let _clientPromise = null;
function getRemote() {
  if (!_clientPromise) {
    _clientPromise = (async () => {
      const client = new Client(
        { name: "macalc-mcp-stdio-proxy", version: SERVER_INFO.version },
        { capabilities: {} }
      );
      const transport = new StreamableHTTPClientTransport(new URL(REMOTE_URL));
      await client.connect(transport);
      return client;
    })().catch((err) => {
      _clientPromise = null;
      throw remoteDownError(err);
    });
  }
  return _clientPromise;
}

function remoteDownError(err) {
  const e = new Error(
    `macalc hosted endpoint unreachable (${REMOTE_URL}): ${err?.message || err}. ` +
      "The wrapper needs network access to that endpoint. Check your connection, " +
      "or the service status at https://macalculatriceenligne.com/mcp/"
  );
  e.cause = err;
  return e;
}

async function main() {
  const server = new Server(SERVER_INFO, {
    capabilities: {
      tools: {},
      prompts: {},
      resources: {},
    },
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    if (!FULL_CATALOG) {
      // Curated core profile — schemas mirrored verbatim from the hosted
      // catalog (see src/core-tools.js). No network needed to list them.
      return { tools: CORE_TOOLS };
    }
    try {
      const remote = await getRemote();
      return await remote.listTools();
    } catch (err) {
      console.error("[macalc-mcp] tools/list failed:", err?.message || err);
      return { tools: [] };
    }
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    let { name, arguments: args } = request.params;
    if (name === "call_any_calculator") {
      const toolName = args?.tool_name;
      if (!toolName || typeof toolName !== "string") {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text:
                "call_any_calculator requires a string `tool_name`. " +
                "Use list_bundles then get_bundle_tools(bundle_id) to find valid names.",
            },
          ],
        };
      }
      name = toolName;
      args = args?.arguments ?? {};
    }
    const remote = await getRemote();
    return await remote.callTool({ name, arguments: args ?? {} });
  });

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    try {
      const remote = await getRemote();
      return await remote.listPrompts();
    } catch (err) {
      console.error("[macalc-mcp] prompts/list failed:", err?.message || err);
      return { prompts: [] };
    }
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const remote = await getRemote();
    return await remote.getPrompt({
      name: request.params.name,
      arguments: request.params.arguments ?? {},
    });
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      const remote = await getRemote();
      return await remote.listResources();
    } catch (err) {
      console.error("[macalc-mcp] resources/list failed:", err?.message || err);
      return { resources: [] };
    }
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const remote = await getRemote();
    return await remote.readResource({ uri: request.params.uri });
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = async () => {
    try {
      if (_clientPromise) {
        const c = await _clientPromise.catch(() => null);
        if (c) await c.close();
      }
    } catch {}
    try {
      await server.close();
    } catch {}
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[macalc-mcp] fatal:", err);
  process.exit(1);
});
