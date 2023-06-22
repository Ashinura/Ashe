const Discord = require("discord.js")

module.exports = {
    name: "unlock",
    description: "Permet de dévérouiller un channel.",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "channel",
            name: "salon",
            description: "le salon a dévérouillé",
            required: false,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "la raison du dévérouillage du salon",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let salon = args.getChannel("salon")
        if(!salon) salon = message.channel

        let channel = message.guild.channels.cache.get(salon.id)
        if(!channel) return message.reply(`\`❌\` | Aucun salon trouvé`)

        let reason = args.getString('raison')
        if(!reason) reason = "Aucune raison fournie."

        if (channel.permissionOverwrites.cache.get(message.guild.roles.everyone.id)?.deny.toArray(true).includes("SendMessages") == true) {

            channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: true,
                Connect: true
            })

            await message.reply({ content: `\`✅\` | Salon dévérouillé, vous pouvez enlever ce message`, ephemeral: true })

            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
    
                .setTitle(`\`🔓\` | Salon dévérouillé`)
                .setDescription(`${message.user} a dévérouillé ce salon   \n\n**Raison : **\`${reason}\``)
    
            await channel.send({embeds: [Embed] })
        }

        else {

            await message.reply({ content: `\`❗\` | Salon déjà dévérouillé`, ephemeral: true })
        }
    }
}