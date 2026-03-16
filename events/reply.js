module.exports = {
  name: "messageCreate",
  async execute(message) {

    if (message.author.bot) return;

    const r = Math.random();

    if (r <= 0.000001) { // 0.0001%
      await message.reply("おめでとう！0.0001％を引いたよ！");
      await message.react("👑");
    }
    else if (r <= 0.00001) { // 0.001%
      await message.reply("おめでとう！0.001％を引いたよ！");
      await message.react("💎");
    }
    else if (r <= 0.00005) { // 0.005%
      await message.reply("おめでとう！0.005％を引いたよ！");
      await message.react("✨");
    }
    else if (r <= 0.001) { // 0.1%
      await message.reply("おめでとう！0.1％を引いたよ！");
      await message.react("🎊");
    }
    else if (r <= 0.005) { // 0.5%
      await message.reply("おめでとう！0.5％を引いたよ！");
      await message.react("🎉");
    }
    else if (r <= 0.01) { // 1%
      await message.reply("おめでとう！1％を引いたよ！");
      await message.react("⭐");
    }

  }
};