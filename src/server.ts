// server.js
import express from "express";
import next from "next";
import { parse } from "url";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const server = app.listen(3000);
const wss = new WebSocketServer({ noServer: true });
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const clients: Set<WebSocket> = new Set();

nextApp.prepare().then(() => {
  app.use((req, res) => {
    nextApp.getRequestHandler()(req, res, parse(req.url, true));
  });

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("New client connected");

    ws.on("message", (message, isBinary) => {
      console.log(`Message received: ${message}`);
      clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          message.toString() !== `{"event":"ping"}`
        ) {
          client.send(message, { binary: isBinary });
        }
      });
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log("Client disconnected");
    });
  });

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url || "/", true);

    // Make sure we all for hot module reloading
    if (pathname === "/_next/webpack-hmr") {
      nextApp.getUpgradeHandler()(req, socket, head);
    }

    // Set the path we want to upgrade to WebSockets
    if (pathname === "/api/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });
});
