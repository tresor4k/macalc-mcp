#!/usr/bin/env node
/**
 * macalc-mcp — stdio wrapper around the hosted macalc Streamable HTTP MCP server.
 *
 * Lets MCP clients that only support stdio (some Claude Desktop setups,
 * older Cursor builds, sandboxed CI environments) reach the hosted endpoint
 * at https://macalculatriceenligne.com/api/mcp without any API key.
 *
 * Design: lazy connect on first request, cached client, graceful degradation
 * if the remote is temporarily unavailable — the server still boots so MCP
 * clients (and registry scanners like Glama) can introspect capabilities.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const REMOTE_URL =
  process.env.MACALC_MCP_URL || "https://macalculatriceenligne.com/api/mcp";

const SERVER_INFO = {
  name: "macalc-mcp",
  version: "0.1.1",
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
      _clientPromise = null; // allow retry on next request
      throw err;
    });
  }
  return _clientPromise;
}

async function main() {
  const server = new Server(SERVER_INFO, {
    capabilities: { tools: {} },
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    try {
      const remote = await getRemote();
      return await remote.listTools();
    } catch (err) {
      console.error("[macalc-mcp] tools/list failed:", err?.message || err);
      return { tools: [] };
    }
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const remote = await getRemote();
    return await remote.callTool({ name, arguments: args ?? {} });
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
