#!/usr/bin/env node
/**
 * macalc-mcp — stdio wrapper around the hosted macalc Streamable HTTP MCP server.
 *
 * Lets MCP clients that only support stdio (some Claude Desktop setups,
 * older Cursor builds, sandboxed CI environments) reach the hosted endpoint
 * at https://macalculatriceenligne.com/api/mcp without any API key.
 *
 * Behavior: boots a local stdio MCP server, opens a Streamable HTTP client
 * to the remote, and proxies tools/list + tools/call through. No local state.
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
  version: "0.1.0",
};

async function connectRemote() {
  const client = new Client(
    { name: "macalc-mcp-stdio-proxy", version: SERVER_INFO.version },
    { capabilities: {} }
  );
  const transport = new StreamableHTTPClientTransport(new URL(REMOTE_URL));
  await client.connect(transport);
  return client;
}

async function main() {
  const remote = await connectRemote();

  const server = new Server(SERVER_INFO, {
    capabilities: { tools: {} },
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return await remote.listTools();
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return await remote.callTool({ name, arguments: args ?? {} });
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = async () => {
    try {
      await remote.close();
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
