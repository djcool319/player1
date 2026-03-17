const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tweet')
    .setDescription('タイムラインにツイートを投稿します')
    .addStringOption(option =>
      option.setName('内容')
        .setDescription('ツイート内容を入力してください')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('匿名')
        .setDescription('匿名でツイートするか選択してください')
        .setRequired(false)
    ),

  async execute(client, interaction) {
    try {
      console.log('コマンド開始');

      if (!interaction.channel.name.includes('タイムライン')) {
        await interaction.reply({
          content: 'このコマンドは「タイムライン」チャンネルでのみ使用できます。',
          ephemeral: true
        });
        return;
      }

      const tweetContent = interaction.options.getString('内容');
      const isAnonymous = interaction.options.getBoolean('匿名') ?? false;

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

      const message = `--------------------------\n**${userName}**: ${tweetContent}`;
      const sentMessage = await interaction.channel.send(message);

      await sentMessage.react('❤️');

      const button = new ButtonBuilder()
        .setCustomId(`delete_${sentMessage.id}`)
        .setLabel('削除')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.reply({
        content: `ツイートを投稿しました！`,
        components: [row],
        ephemeral: true
      });

      const filter = i =>
        i.customId === `delete_${sentMessage.id}` &&
        i.user.id === interaction.user.id;

      const collector = sentMessage.createMessageComponentCollector({
        filter,
        time: 600000
      });

      collector.on('collect', async i => {
        try {
          await sentMessage.delete();
          await i.reply({
            content: '削除しました',
            ephemeral: true
          });
          collector.stop();
        } catch (err) {
          console.error(err);
        }
      });

    } catch (err) {
      console.error(err);

      if (interaction.replied) {
        await interaction.followUp({
          content: 'エラーが発生しました',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'エラーが発生しました',
          ephemeral: true
        });
      }
    }
  }
};