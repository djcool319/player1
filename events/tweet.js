import pkg from 'discord.js';
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Emoji } = pkg;

export const data = new SlashCommandBuilder()
  .setName('tweet')
  .setDescription('タイムラインにツイートを投稿します')
  .addStringOption(option =>
    option.setName('内容')
      .setDescription('ツイート内容を入力してください')
      .setRequired(true)
  )
  .addBooleanOption(option =>
    option.setName('匿名')
      .setDescription('匿名でツイートするか選択してください ※悪用厳禁')
      .setRequired(false)
  );

export const execute = async (interaction) => {
  try {
    console.log('コマンド開始');
    const channelNameContainsTimeline = interaction.channel.name.includes('タイムライン');

    // チャンネルが「タイムライン」でない場合、エラーメッセージを表示
    if (!channelNameContainsTimeline) {
      await interaction.reply({
        content: 'このコマンドは「タイムライン」チャンネルでのみ使用できます。',
        ephemeral: true
      });
      return;
    }

    const tweetContent = interaction.options.getString('内容');
    const isAnonymous = interaction.options.getBoolean('匿名'); // 匿名オプションを取得

    // サーバーメンバーを取得し、ニックネームを使用
    const member = interaction.guild.members.cache.get(interaction.user.id);
    const userName = isAnonymous ? '匿名' : (member ? member.displayName : interaction.user.username); // サーバーのニックネームを取得

    const message = `--------------------------\n**${userName}**: ${tweetContent}`;
    const sentMessage = await interaction.channel.send(message);
    console.log('ツイート送信完了');

    // ハートのリアクションを追加
    await sentMessage.react('♥️');
    console.log('ハートのリアクションを追加しました');

    // エフェメラルメッセージに削除ボタンを追加
    const button = new ButtonBuilder()
      .setCustomId(`delete_tweet_${sentMessage.id}`)  // ツイートIDをcustomIdに設定
      .setLabel('削除')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: `ツイートを投稿しました！\n「${tweetContent}」`,
      components: [row],
      ephemeral: true
    });
    console.log('エフェメラルメッセージ送信完了');

    // ボタンが押されたときの処理
    const filter = (i) => i.customId.startsWith('delete_tweet_') && i.user.id === interaction.user.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 0 // 無制限で待機
    });

    collector.on('collect', async (i) => {
      try {
        console.log('削除ボタンが押されました');
        
        // customIdからメッセージIDを取得
        const tweetId = i.customId.split('_')[2];  // delete_tweet_<メッセージID>
        const messageToDelete = await interaction.channel.messages.fetch(tweetId);

        // メッセージを削除
        await messageToDelete.delete();
        await i.reply({ content: 'ツイートが削除されました。', ephemeral: true });
      } catch (err) {
        console.error('削除時のエラー:', err);
        await i.reply({ content: 'ツイートの削除中にエラーが発生しました。', ephemeral: true });
      }
    });

  } catch (err) {
    console.error('コマンド実行中のエラー:', err);
    await interaction.reply({
      content: `エラーが発生しました: ${err.message}`,
      ephemeral: true
    });
  }
};

