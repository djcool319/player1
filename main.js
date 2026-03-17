const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const fs = require('node:fs');
const path = require('node:path');

// ===== TOKENチェック =====
if (!process.env.TOKEN) {
  console.error("TOKENが読み込まれていません");
  process.exit(1);
} else {
  console.log("TOKEN取得OK");
}

//-----------commands------------

// スラッシュコマンド
client.commands = new Collection();
const slashcommandsPath = path.join(__dirname, 'commands');
const slashcommandFiles = fs.readdirSync(slashcommandsPath).filter(file => file.endsWith('.js'));

for (const file of slashcommandFiles) {
  const slashfilePath = path.join(slashcommandsPath, file);
  const command = require(slashfilePath);
  console.log(`-> [Loaded Command] ${file.split('.')[0]}`);
  client.commands.set(command.data.name, command);
}

// イベント
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventsFiles) {
  const eventfilePath = path.join(eventsPath, file);
  const event = require(eventfilePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
  console.log(`-> [Loaded Event] ${file.split('.')[0]}`);
}

// ===== ここ超重要：ログイン状態を可視化 =====

// readyイベント（ログイン成功時）
client.once(Events.ClientReady, c => {
  console.log(`ログイン完了: ${c.user.tag}`);
});

// エラー拾う
client.on("error", err => {
  console.error("Clientエラー:", err);
});

client.on("shardError", err => {
  console.error("Shardエラー:", err);
});

// ===== ログイン処理 =====
console.log("ログイン処理開始");

client.login(process.env.TOKEN)
  .then(() => console.log("login() 成功"))
  .catch(err => console.error("ログイン失敗:", err));

  console.log("TOKEN長さ:", process.env.TOKEN.length);
console.log("TOKEN末尾:", JSON.stringify(process.env.TOKEN.slice(-5)));

// Interaction
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'コマンドがありません', ephemeral: true });
  }
});