const Discord = require("discord.js")
const loadSlashCommands = require("../Loaders/loadSlashCommands")


module.exports = async (bot) => {

    await loadSlashCommands(bot)

    console.log(`\n🗿 ▬ ${bot.user.tag}\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n`)
}