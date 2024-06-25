import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

const rooms = new Map();

wss.on("connection", function connection(ws) {
  console.log("クライアントが接続しました");

  ws.on("message", function message(data) {
    const message = JSON.parse(data.toString());

    if (message.type === "join") {
      const roomName = message.room;
      if (!rooms.has(roomName)) {
        rooms.set(roomName, new Set());
      }
      rooms.get(roomName).add(ws);
      console.log(`クライアントがルーム${roomName}に参加しました`);
    } else if (message.type === "broadcast") {
      const roomName = message.room;
      if (rooms.has(roomName)) {
        rooms.get(roomName).forEach((client: any) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      }
    }
  });

  ws.on("close", () => {
    rooms.forEach((clients, roomName) => {
      if (clients.has(ws)) {
        clients.delete(ws);
        console.log(`クライアントがルーム${roomName}から退出しました`);
      }
    });
  });
});
