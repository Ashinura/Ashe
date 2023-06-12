const Discord = require("discord.js")

module.exports = {

    name: "unban",
    description: "Débannir un membre",
    permission: Discord.PermissionFlagsBits.BanMembers,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à débannir",
            required: true,
            autocomplete: false
        }, 
        {
            type: "string",
            name: "raison",
            description: "La raison du débannissement", 
            required: false,
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

            let user = await bot.users.fetch(args._hoistedOptions[0].value)
            if (!user) return message.reply("\`❗\` | Pas de membre à débannir")

            let reason = args.getString("raison")
            if (!reason) { reason = "Aucune raison fournie."}

            if ( (await message.guild.bans.fetch()).get(user.id).size <= 0 ) return message.reply("\`❌\` | Ce membre n'est pas banni")

            try {await user.send(`Tu as été débanni de \`${message.guild.name}\`\n\nRaison : \`${reason}\``)} catch(err) {}


            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))

                .setTitle(`🛡️ | Quelqu'un est débanni`)
                .setDescription(`${message.user} a débanni : \`${user.tag}\`   \n\n**Raison : **\`${reason}\``)

            await message.reply({embeds: [Embed] })

        } catch (err) {

            return message.reply("\`❗\` | Aucun utilisateur trouvé")
        }
    }
}