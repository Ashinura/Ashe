const Discord = require("discord.js")
const ms = require("ms")

module.exports = {

    name: "mute",
    description: "Mute un membre",
    permission: "Aucune",
    category: "Modération",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à mute",
            required: true,
            autocomplete: false
        }, 
        {
            type: "string",
            name: "temps",
            description: "La durée du mute. ( écrire 14d pour 14 jours  |  4h -> 4 heures  |  5m -> minutes )", 
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "raison",
            description: "La raison du mute", 
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

        let user = await bot.users.fetch(args._hoistedOptions[0].value)
        if (!user) return message.reply("\`❗\` | Pas de membre à mute")

        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("\`❗\` | Ce membre n'est pas dans le serveur")

        let time = args.getString("temps")
        if (!time) return message.reply("\`❗\` | Aucune durée définie")
        if (isNaN(ms(time))) return message.reply("\`❗\` | Veuillez indiquer un nombre correct")
        if (ms(time) > 2419200000) return message.reply("\`❗\` | La durée maximum d'un mute est de 28 jours soit 4 semaines")

        let reason = args.getString("raison")
        if (!reason) { reason = "Aucune raison fournie."}

        let notif = args.getString("notification")
        if (!notif) notif = 'Non'


        let result = time.indexOf("d")
        let durée = "Not found"

        if (result != -1) { durée = time.replace("d", " jours") }

        else {

            result = time.indexOf("h")
            if (result != -1) { durée = time.replace("h", " heures") }

            else {

                result = time.indexOf("m")
                if (result != -1) { durée = time.replace("m", " minutes") }

                else {

                    durée = time.replace("s", " secondes")
                }
            }
        }

        if (message.user.id === user.id) return message.reply("\`❌\` | Tu ne peux pas te mute")
        if ( (await message.guild.fetchOwner()).id === user.id) return message.reply("\`❌\` | Tu ne peux pas mute le propriétaire de ce serveur")
        if (member && member.moderetable == false) return message.reply("\`❌\` | Ce membre ne peux pas être mute")
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("\`❌\` | Ce membre est supérieur à toi")
        if (member.isCommunicationDisabled()) return message.reply("\`❌\` | Ce membre est déjà mute")

        if (notif == 'Oui') {

            const notifuser = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        
            .setTitle(`🤐 | Tu as été mute`)
            .setDescription(`Tu as été mute de \`${message.guild.name}\`   \n\n**Durée :** \`${durée}\`\n**Raison :** \`${reason}\``)

            try {await user.send({embeds: [notifuser]})} catch(err) {}
        }

        await member.timeout(ms(time), reason)

        const Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
        
            .setTitle(`🤐 | Quelqu'un est mute`)
            .setDescription(`${message.user} a mute : \`${user.tag}\`   \n\n**Durée :** \`${durée}\`\n**Raison : **\`${reason}\`\n**Notification : **\`${notif}\``)

        await message.reply({embeds: [Embed] })
    }
}