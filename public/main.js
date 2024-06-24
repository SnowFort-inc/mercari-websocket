// WebSocketサーバーのURLを指定
// 例: サーバーが同じドメインの特定のポートでリッスンしている場合
const wsUrl = `ws://${window.location.hostname}:3000/socket.io/`;

// WebSocketオブジェクトを作成し、サーバーに接続
const ws = new WebSocket(wsUrl);
console.log(ws);

// 接続が開かれたときのイベントハンドラ
ws.onopen = function (event) {
  console.log("サーバーに接続しました");
  // サーバーにメッセージを送信
  ws.send("こんにちは、サーバー！");
};

// サーバーからメッセージを受信したときのイベントハンドラ
ws.onmessage = function (event) {
  console.log("サーバーからのメッセージ: " + event.data);
};

// 接続が閉じられたときのイベントハンドラ
ws.onclose = function (event) {
  console.log("サーバーとの接続が閉じました");
};

// エラーが発生したときのイベントハンドラ
ws.onerror = function (error) {
  console.error("WebSocketエラーが発生しました: ", error);
};
