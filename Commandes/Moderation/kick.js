const Discord = require("discord.js")

module.exports = {

    name: "kick",
    description: "Expulser un membre",
    permission: Discord.PermissionFlagsBits.KickMembers,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à expulser",
            required: true,
            autocomplete: false
        }, 
        {
            type: "string",
            name: "raison",
            description: "La raison de l'expulsion", 
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

        let user = args.getUser("membre")
        if (!user) return message.reply("\`❗ |\` Pas de membre à expulser")

        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("\`❗ |\` Pas de membre à expulser")

        let reason = args.getString("raison")
        if (!reason) {reason = "Aucune raison fournie."}

        let notif = args.getString("notification")
        if (!notif) notif = 'Non'

        if (message.user.id === user.id) return message.reply("\`❌ |\` Tu ne peux pas te expulser")
        if ( (await message.guild.fetchOwner()).id === user.id) return message.reply("\`❌ |\` Tu ne peux pas expulser le propriétaire de ce serveur")
        if (member && member.kickable == false) return message.reply("\`❌ |\` Ce membre ne peux pas être expulser")
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("\`❌ |\` Ce membre est supérieur à toi")

        if (notif == 'Oui') {

            const notifuser = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        
            .setTitle(`\`🥊\` | Tu as été expulsé`)
            .setDescription(`Tu as été expulsé de \`${message.guild.name}\`   \n\n**Raison :** \`${reason}\``)

            try {await user.send({embeds: [notifuser]})} catch(err) {}
        }


        await member.kick(reason)


        const Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        
            .setTitle(`\`🥊\` | Expulsion d'un membre !`)
            .setDescription(`${message.user} a expulser : \`${user.tag}\`   \n\n**Raison : **\`${reason}\`\n**Notification : **\`${notif}\``)

        await message.reply({embeds: [Embed] })
    }
}