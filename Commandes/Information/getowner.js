const Discord = require("discord.js")

module.exports = {

    name: "getowner",
    description: "Permet d'avoir des informations sur le propriétaire du serveur",
    permission: "Aucune",
    category: "Information",
    dm: false,

    async run(bot, message) {

        const guildId = message.guildId;
        const guild = await bot.guilds.fetch(guildId);
        const owner = await guild.fetchOwner();
        message.reply(`Le propriétaire du serveur ${guild.name} est ${owner.user.username}.`);
    }
}