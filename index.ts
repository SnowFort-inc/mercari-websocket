import { WebSocketServer } from "ws";
import WebSocket from "ws";

interface Message {
  type: "join" | "broadcast";
  room: string;
}

const wss = new WebSocketServer({ port: 3000 });
const rooms = new Map<string, Set<WebSocket>>();

const joinRoom = (ws: WebSocket, roomName: string) => {
  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Set<WebSocket>());
  }
  rooms.get(roomName)?.add(ws);
  console.log(`クライアントがルーム${roomName}に参加しました`);
};

const broadcastMessage = (ws: WebSocket, message: Message) => {
  const roomName = message.room;
  rooms.get(roomName)?.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      console.log(`メッセージを送信しました: ${JSON.stringify(message)}`);
      client.send(JSON.stringify(message));
    }
  });
};

wss.on("connection", (ws: WebSocket) => {
  console.log("クライアントが接続しました");

  ws.on("message", (data: WebSocket.Data) => {
    const message: Message = JSON.parse(data.toString());
    const { type, room: roomName } = message;

    switch (type) {
      case "join":
        joinRoom(ws, roomName);
        break;
      case "broadcast":
        if (rooms.has(roomName)) {
          broadcastMessage(ws, message);
        }
        break;
    }
  });

  ws.on("close", () => {
    rooms.forEach((clients, roomName) => {
      if (clients.delete(ws)) {
        console.log(`クライアントがルーム${roomName}から退出しました`);
      }
    });
  });
});
