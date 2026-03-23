module.exports = {
  name: "messageCreate",
  async execute(message, client) {

    if (message.author.bot) return;

    // メンションされたときの処理
    if (message.mentions.has(client.user)) {
      const replies = [
        "呼んだ？",
        "どうした？",
        "なにか用？",
        "ここにいるよ",
        "はいはい〜",
        "何？"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return message.reply(randomReply);
    }

    // 既存の確率イベント
    const r = Math.random();

    if (r <= 0.000001) {
      await message.reply("おめでとう！0.0001％を引いたよ！");
      await message.react("👑");
    }
    else if (r <= 0.00001) {
      await message.reply("おめでとう！0.001％を引いたよ！");
      await message.react("💎");
    }
    else if (r <= 0.00005) {
      await message.reply("おめでとう！0.005％を引いたよ！");
      await message.react("✨");
    }
    else if (r <= 0.001) {
      await message.reply("おめでとう！0.1％を引いたよ！");
      await message.react("🎊");
    }
    else if (r <= 0.005) {
      await message.reply("おめでとう！0.5％を引いたよ！");
      await message.react("🎉");
    }
    else if (r <= 0.01) {
      await message.reply("おめでとう！1％を引いたよ！");
      await message.react("⭐");
    }
  }
};