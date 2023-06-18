const Discord = require("discord.js")

module.exports = {

    name: "clear",
    description: "Supprimer des messages",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "number",
            name: "nombre",
            description: "Le nombres de messages à supprimer",
            required: false,
            autocomplete: false
        },
        {
            type: "user",
            name: "membre",
            description: "Supprime uniquement les messages du membre",
            required: false,
            autocomplete: false
        },
        {
            type: "channel",
            name: "salon",
            description: "Le salon où effacer les messages",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let number = args.getNumber("nombre")
        if (!number) { number = 99 }
        if (parseInt(number) < 1 || parseInt(number) > 100) return message.reply("\`❌\` | Nombres entier entre 1 et 99 uniquements")

        let channel = args.getChannel("salon")
        if (!channel) { channel = message.channel }
        if (channel.id !== message.channel.id && !message.guild.channels.cache.get(channel.id)) return message.reply("\`❗\` | Aucun salon trouvé")

        let user = args.getUser("membre")
        let member = undefined
        let memberID = undefined

        if (user !== null) { 

            member = message.guild.members.cache.get(user.id) 
            memberID = member.id
        }

        await message.deferReply({ephemeral: true})

        if (user === null) {

            try {

                let clear = await channel.bulkDelete(parseInt(number))
    
                await message.editReply(`Suppression de **${clear.size}** messages dans le salon ${channel} terminé`)
            } 
            
            catch (err) {

                let messages = [...(await channel.messages.fetch()).filter(msg => !msg.interaction && (Date.now() - msg.createdAt) < 1209600000).values()] 
    
                if (messages.length <= 0) return message.followUp({content: "\`❌\` | **Aucun** messages à supprimer car ils datent tous de + de 14 jours", ephemeral: true})
    
                else {

                    await channel.bulkDelete(messages)
                
                    await message.editReply({content: `\`❗\` | Suppression de **${messages.length}** messages uniquement car les autres messages dataient de + de 14 jours`, ephemeral: true})
                }
            }
        }


        else if (user !== null && memberID === user.id) {

            try {

                const messages = [...(await channel.messages.fetch()).values()].filter(msg => msg.author.id === memberID).slice(0, parseInt(number))

                if (messages.length <= 0) return message.editReply({content: `\`❌\` | **${user.tag}** n'a envoyé aucun messages dans ce salon`, ephemeral: true})

                else {

                    const clear = await channel.bulkDelete(messages)
    
                    await message.editReply({content: `Suppression de **${clear.size}** messages de **${user.tag}** dans le salon ${channel} terminé`, ephemeral: true})
                }
            } 
            
            catch (err) {

                const messages = [...(await channel.messages.fetch()).values()].filter(msg => msg.author.id === memberID && (Date.now() - msg.createdAt) <= 1209600000).slice(0, parseInt(number))

                if (messages.length <= 0) return message.followUp({content: "\`❌\` | **Aucun** messages à supprimer car ils datent tous de + de 14 jours", ephemeral: true})
    
                else {

                    await channel.bulkDelete(messages)

                    await message.editReply(`\`❗\` | Suppression de **${messages.length}** messages de **${user.tag}** uniquement car les autres messages dataient de + de 14 jours`)
                }
            }
        }
    }
}