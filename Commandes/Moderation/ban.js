const Discord = require("discord.js")

module.exports = {

    name: "ban",
    description: "Bannir un membre",
    permission: Discord.PermissionFlagsBits.BanMembers,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à bannir",
            required: true,
            autocomplete: false
        }, 
        {
            type: "string",
            name: "raison",
            description: "La raison du bannissement", 
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "notification",
            description: "Est ce que le membre reçoit une notification en MP, 'Oui' par défaut", 
            required: false,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {

        try {

            let user = args.getUser("membre")
            if (!user) return message.reply("\`❗\` | Pas de membre à bannir")

            let member = message.guild.members.cache.get(user.id)

            let reason = args.getString("raison")
            if (!reason) { reason = "Aucune raison fournie."}

            let notif = args.getString("notification")
            if (!notif) notif = 'Non'

            if (message.user.id === user.id) return message.reply("\`❌\` | Tu ne peux pas te bannir")
            if ( (await message.guild.fetchOwner()).id === user.id) return message.reply("\`❌\` | Tu ne peux pas bannir le propriétaire de ce serveur")
            if (member && member.bannable == false) return message.reply("\`❌\` | Ce membre ne peux pas être banni")
            if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("\`❌\` | Ce membre est supérieur à toi")
            if ( (await message.guild.bans.fetch()).get(user.id) ) return message.reply("\`❌\` | Ce membre est déjà banni")

            if (notif == 'Oui') {

                const notifuser = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
            
                .setTitle(`\`🛡️\` | Tu as été banni`)
                .setDescription(`Tu as été banni de \`${message.guild.tag}\`\n\nRaison : \`${reason}\``)
    
                try {await user.send({embeds: [notifuser]})} catch(err) {}
            }


            await message.guild.bans.create(user.id, {reason: reason})


            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))

                .setTitle(`\`🛡️\` | Quelqu'un est banni`)
                .setDescription(`${message.user} a banni : \`${user.tag}\`   \n\n**Raison : **\`${reason}\`\n**Notification : **\`${notif}\``)

            await message.reply({embeds: [Embed] })

        } catch (err) {

            return message.reply("\`❗\` | Aucun utilisateur trouvé")
        }
    }
}