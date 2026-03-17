require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require("fs");
const app = express();

app.use(express.static(path.join(__dirname, 'pages')));

app.get("/", (req, res) => {
  fs.readFile("./pages/index.html", (err, data) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  });
});

// ===== ここ重要：TOKEN確認 =====
if (!process.env.TOKEN) {
  console.error("TOKENが読み込まれていません");
  process.exit(1);
} else {
  console.log("TOKEN読み込みOK");
}

// ===== Bot起動 =====
try {
  require('./main.js');
} catch (err) {
  console.error("main.jsの読み込み失敗:", err);
}

// サーバーを起動
app.listen(3000, () => {
  console.log(`サーバーを開きました`);
});