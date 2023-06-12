const Discord = require("discord.js")

module.exports = {

    name: "servinfo",
    description: "Permet d'avoir des informations sur le serveur",
    permission: "Aucune",
    category: "Information",
    dm: false,

    async run(bot, message) {

        const Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setImage(message.guild.bannerURL({ dynamic: true, size: 4096 }))
            .setTitle("Informations sur le serveur :")

            .setDescription(`**Propriétaire :** ${(await message.guild.fetchOwner())}
            **Nom du serveur :** \`${message.guild.name}\`
            **Description :** \`${message.guild.description ? message.guild.description : "Aucune"}\`
            \n**ID du serveur :** \`${message.guild.id}\`
            **Date de création :** <t:${Math.floor(message.guild.createdAt / 1000)}:F>


            **▬▬ Statistiques ▬▬**

            **Membres :** \`${message.guild.members.cache.size}\`
            **Rôles :** \`${message.guild.roles.cache.size}\`
            **Salons :** \`${message.guild.channels.cache.size}\`
            **Emojis :** \`${message.guild.emojis.cache.size}\`
            **Boost :** \`${message.guild.premiumSubscriptionCount}\`


            **▬▬ Salons spéciaux ▬▬**

            **Règlement :** ${message.guild.rulesChannel ? message.guild.rulesChannel : "Aucun"}
            **AFK :** ${message.guild.afkChannel ? message.guild.afkChannel : "Aucun"}`)

        await message.reply({ embeds: [Embed] })
    }
}