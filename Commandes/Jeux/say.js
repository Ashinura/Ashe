const Discord = require('discord.js')

module.exports = {

    name: "say", 
    description: "Fait dire quelques chose au bot ", 
    permission: "Aucune",
    category: "Jeux",
    dm: false,
    options: [
        {
            type: "string",
            name: "phrase",
            description: "La phrase que vous voulez dire",
            required: true,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        const usermsg = args.getString('phrase')

        message.channel.send({content: usermsg, ephemeral: true})
        await message.reply({content: '✅ | Envoie effectué, vous pouvez enlever ce message', ephemeral: true})
    }  
}