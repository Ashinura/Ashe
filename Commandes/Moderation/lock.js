const Discord = require("discord.js")
const { connect } = require("mongoose")

module.exports = {
    name: "lock",
    description: "Permet de vérouiller un channel; Personne ne pourra écrire sauf les membres importants",
    permission: Discord.PermissionFlagsBits.ManageChannels,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "channel",
            name: "salon",
            description: "le salon a vérouillé",
            required: false,
            autocomplete: false
        }, {
            type: "string",
            name: "raison",
            description: "la raison du vérouillage du salon",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let salon = args.getChannel("salon")
        if (!salon) salon = message.channel

        let channel = message.guild.channels.cache.get(salon.id)
        if (!channel) return message.reply(`\`❌\` | Aucun salon trouvé`)

        let reason = args.getString('raison')
        if (!reason) reason = "Aucune raison fournie."


        if (channel.permissionOverwrites.cache.get(message.guild.roles.everyone.id)?.deny.toArray(true).includes("SendMessages")) {
            
            await message.reply({ content: `\`❗\` | Salon déjà vérouillé`, ephemeral: true })
        }

        else {

            channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: false, 
                Connect: false
            })
    
            await message.reply({ content: `\`✅\` | Salon vérouillé, vous pouvez enlever ce message`, ephemeral: true })
    
    
            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
    
                .setTitle(`\`🔐\` | Salon vérouillé`)
                .setDescription(`${message.user} a vérouillé ce salon   \n\n**Raison : **\`${reason}\``)
    
            await channel.send({embeds: [Embed] })
        }
    }
}