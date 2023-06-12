const Discord = require("discord.js")

module.exports = {

    name: "link", 
    description: "Donne le lien d'invitation du bot", 
    permission: "Aucune",
    category: "Utile",
    dm: true,

    async run(bot, message) {

        const link = 'https://discord.com/api/oauth2/authorize?client_id=1025048416327319563&permissions=8&scope=bot%20applications.commands' 
    
        await message.reply(`Oooh, vous m'invitée sur un serveur ?\n\n${link}`)
    }
}