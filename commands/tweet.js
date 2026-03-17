const { 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('newtweet')
    .setDescription('タイムラインにツイートを投稿します')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('ツイート内容を入力してください')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('anonymous')
        .setDescription('匿名でツイートするか選択してください')
        .setRequired(false)
    ),

  async execute(client, interaction) {
    try {
      // --- 最初に defer で応答保留（3秒タイムアウト回避） ---
      await interaction.deferReply({ ephemeral: true });

      const tweetContent = interaction.options.getString('content');
      const isAnonymous = interaction.options.getBoolean('anonymous') ?? false;

      // --- ユーザー名取得 ---
      let userName;
      if (isAnonymous) {
        userName = '匿名';
      } else {
        try {
          const member = await interaction.guild.members.fetch(interaction.user.id);
          userName = member.displayName;
        } catch {
          userName = interaction.user.username;
        }
      }

      // --- メッセージ送信 ---
      const messageText = `--------------------------\n**${userName}**: ${tweetContent}`;
      const sentMessage = await interaction.channel.send(messageText);
      await sentMessage.react('❤️');

      // --- 削除ボタン作成 ---
      const button = new ButtonBuilder()
        .setCustomId(`delete_${sentMessage.id}`)
        .setLabel('削除')
        .setStyle(ButtonStyle.Danger);
      const row = new ActionRowBuilder().addComponents(button);

      // --- deferReply 後は followUp で応答 ---
      await interaction.followUp({
        content: 'ツイートを投稿しました！',
        components: [row],
        ephemeral: true
      });

      // --- ボタン押下で削除 ---
      const filter = i => i.customId === `delete_${sentMessage.id}` && i.user.id === interaction.user.id;
      const collector = sentMessage.createMessageComponentCollector({ filter, time: 600000 });

      collector.on('collect', async i => {
        try {
          await sentMessage.delete();
          await i.reply({ content: '削除しました', ephemeral: true });
          collector.stop();
        } catch (err) {
          console.error(err);
        }
      });

    } catch (err) {
      console.error(err);
      // --- 例外時も必ず応答 ---
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: 'エラーが発生しました', ephemeral: true });
      } else {
        await interaction.reply({ content: 'エラーが発生しました', ephemeral: true });
      }
    }
  }
};