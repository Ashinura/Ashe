const Discord = require("discord.js")

module.exports = {

    name: "userinfo",
    description: "Permet d'avoir des informations sur vous ou un utilisateur",
    permission: "Aucune",
    category: "Information",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre dont vous voulez avoir les informations",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        try {

            let user = args.getUser('membre')

            if (!user) user = message.user

            let member = message.guild.members.cache.get(user.id)

            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setTitle(`Informations sur ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({dynamic: true}))
                .setDescription(`**Surnom** : \`${member.nickname ? member.nickname : "Aucun"}\`
                **Pseudo** : \`${user.username}\`
                **Tag** : \`${user.discriminator}\`
                **ID** : \`${user.id}\`
                \n**Rôles (${member.roles.cache.size})** : ${member.roles.cache.map(r => `${r}`).join(" ")}
                \n**Date d'arrivée sur le serveur** : <t:${Math.floor(member.joinedAt / 1000)}:F>
                **Date de création du compte** : <t:${Math.floor(user.createdAt / 1000)}:F>
                \n**Robot** : \`${user.bot ? "Oui" : "Non"}\``)
                
            await message.reply({embeds: [Embed]})

        } catch (err) {

            console.log(err)
            return message.reply("❌ | Aucune personne trouvée !")
        }
    }
}