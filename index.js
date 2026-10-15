const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

const TOKEN = process.env.TOKEN;
const MEMBER_ROLE_ID = '1560300349611573308';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
    console.log(`✅ Success! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!setup-verify') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ You need Administrator permissions to use this command.');
        }

        const embed = new EmbedBuilder()
            .setTitle('✈️ Jet Way Verification')
            .setDescription('Welcome to **Jet Way**!\n\nClick the button below to verify your account and unlock access to all server channels.')
            .setColor('#0099ff');

        const verifyButton = new ButtonBuilder()
            .setCustomId('verify_member_button')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const row = new ActionRowBuilder().addComponents(verifyButton);

        await message.channel.send({ embeds: [embed], components: [row] });
        await message.delete().catch(() => {});
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'verify_member_button') {
        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(MEMBER_ROLE_ID);

        if (!role) {
            return interaction.reply({ content: '❌ Role error: Member role ID not found in server settings.', ephemeral: true });
        }

        if (member.roles.cache.has(MEMBER_ROLE_ID)) {
            return interaction.reply({ content: ' You are already verified!', ephemeral: true });
        }

        try {
            await member.roles.add(role);
            return interaction.reply({ content: '✅ You have been verified! Enjoy **Jet Way**.', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ 
                content: '❌ Failed to assign role. Make sure the bot role is positioned HIGHER than the Member role in Server Settings!', 
                ephemeral: true 
            });
        }
    }
});

client.login(TOKEN);