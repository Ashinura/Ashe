const Discord = require("discord.js")

module.exports = {

    name: "rmtimeout",
    description: "Enlever le time-out d'un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre dont vous voulez arrêter le time-out",
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "La raison de l'arrêt de le time-out", 
            required: true,
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
        if (!user) return message.reply("\`❗ |\` Aucun membre à enlever le time-out")

        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("\`❗ |\` Aucun membre à enlever le time-out")

        let reason = args.getString("raison")
        if (!reason) { reason = "Aucune raison fournie."}

        let notif = args.getString("notification")
        if (!notif) notif = 'Non'

        if (member && member.moderetable == false) return message.reply("\`❌ |\`Tu ne peux pas enlever le time-out de ce membre")
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("\`❌ |\`Ce membre est supérieur à toi")
        if (!member.isCommunicationDisabled()) return message.reply("\`❌ |\`Ce membre n'est pas time-out")

        if (notif == 'Oui') {

            const notifuser = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        
            .setTitle(`\`😮‍💨\` | Tu n'est plus time-out`)
            .setDescription(`Tu n'est plus time-out de \`${message.guild.name}\`   \n\n**Raison :** \`${reason}\``)

            try {await user.send({embeds: [notifuser]})} catch(err) {}
        }


        await member.timeout(null, reason)


        const Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        
            .setTitle(`\`😮‍💨\` | Quelqu'un a enlever le time-out d'un membre`)
            .setDescription(`${message.user} a enlever le time-out de : \`${user.tag}\`   \n\n**Raison : **\`${reason}\`\n**Notification : **\`${notif}\``)

        await message.reply({embeds: [Embed] })
    }
}