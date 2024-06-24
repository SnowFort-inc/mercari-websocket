// WebSocketサーバーの実装
import { WebSocketServer } from "ws";

// WebSocketサーバーをポート8080で起動
const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function connection(ws) {
  console.log("クライアントが接続しました");

  // クライアントからのメッセージを受信した時の処理
  ws.on("message", function message(data) {
    console.log("受信したメッセージ:", data.toString());
  });

  // クライアントへメッセージを送信
  ws.send("サーバーからのメッセージ");
});
