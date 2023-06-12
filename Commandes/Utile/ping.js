const Discord = require("discord.js")

module.exports = {
    name: "ping",
    description: "Affiche la latence",
    permission: "Aucune",
    category: "Utile",
    dm: true,

    async run(bot, message, guild) {

        await message.reply(`**Ping** : \`${bot.ws.ping} ms\``)
    }
}