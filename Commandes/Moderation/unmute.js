const Discord = require("discord.js")

module.exports = {

    name: "unmute",
    description: "Unmute un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à unmute",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du unmute", 
            required: false,
            autocomplete: false
        },
        {
            type: "string",
            name: "notification",
            description: "Est ce que le membre reçoit une notification en MP? 'Oui' par défaut", 
            required: false,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {

        let user = await bot.users.fetch(args._hoistedOptions[0].value)
        if (!user) return message.reply("\`❗ |\` Pas de membre à bannir")

        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("\`❗ |\` Pas de membre à expulser")

        let reason = args.getString("raison")
        if (!reason) { reason = "Aucune raison fournie."}

        let notif = args.getString("notification")
        if (!notif) notif = 'Oui'

        if (member && member.moderetable == false) return message.reply("\`❌ |\`Ce membre ne peux pas être unmute")
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("\`❌ |\`Ce membre est supérieur à toi")
        if (!member.isCommunicationDisabled()) return message.reply("\`❌ |\`Ce membre n'est pas mute")

        if (notif == 'Oui') {

            const notifuser = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        
            .setTitle(`😮‍💨 | Tu as été unmute`)
            .setDescription(`Tu as été unmute de \`${message.guild.name}\`   \n\n**Raison :** \`${reason}\``)

            try {await user.send({embeds: [notifuser]})} catch(err) {}
        }


        await member.timeout(null, reason)


        const Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        
            .setTitle(`😮‍💨 | Quelqu'un est unmute`)
            .setDescription(`${message.user} a mute : \`${user.tag}\`   \n\n**Raison : **\`${reason}\`\n**Notification : **\`${notif}\``)

        await message.reply({embeds: [Embed] })
    }
}