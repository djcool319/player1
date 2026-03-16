module.exports = {
  name: "messageCreate",
  async execute(message) {

    if (message.author.bot) return;

    const replies = [
      "こんにちは",
      "やあ",
      "元気？",
      "どうした？",
      "呼んだ？",
      "はい？"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    message.reply(randomReply);

  }
};