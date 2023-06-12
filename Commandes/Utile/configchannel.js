const Discord = require("discord.js")
const { MongoClient } = require("mongodb")
const mongoose = require('mongoose')

const { Guilds } = require("../../Database/loadModels")
const { cluster } = require("../../config.json")
const client = new MongoClient(cluster)


module.exports = {
    name: "configchannel",
    description: "Permet de configurer un salon pour envoyer un message lors d'un évènement quelconque",
    permission: Discord.PermissionFlagsBits.ManageGuild,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "channel",
            name: "salon",
            description: "le salon a vérouillé",
            required: true,
            autocomplete: false
        }, {
            type: "string",
            name: "évènement",
            description: "Pour quel occasion le bot envoie un message personnalisé",
            required: true,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {

        let salon = args.getChannel("salon")
        if (!salon) salon = message.channel

        let channel = message.guild.channels.cache.get(salon.id)
        if (!channel) return message.reply(`\`❌\` | Aucun salon trouvé`)

        let event = args.getString('évènement')
        if (!event) return message.reply(`\`❌\` | Aucun évènement trouvé`)

        let newEvent = event

        if (event == "Quand un membre arrive sur le serveur") event = "onMembersJoin"
        else if (event == "Quand un membre quitte le serveur") event = "onMembersLeave"
        else if (event == "Quand un membre arrive ou quitte le serveur") event = "onMembersJoinOrLeave"

        let oldEvent = event

        async function updateChannels() {

            await client.connect()
    
            const db = client.db("Ashe")
            const guilds_coll = db.collection('guilds')

            const guildDataBefore = await guilds_coll.findOne({guildID: message.guild.id})

            if (event == "onMembersJoin") {

                oldEvent = guildDataBefore.memberAddChannel

                await guilds_coll.updateOne({guildID: message.guild.id}, {
                    $set: {
        
                        memberAddChannel: channel.id
                    }
                })
            }

            if (event == "onMembersLeave") {

                oldEvent = guildDataBefore.memberRemoveChannel

                await guilds_coll.updateOne({guildID: message.guild.id}, {
                    $set: {
    
                        memberRemoveChannel: channel.id
                    }
                })
            }


            if (event == "onMembersJoinOrLeave") {

                oldEvent = "Non trouvé"

                await guilds_coll.updateOne( {guildID: message.guild.id}, {
                    $set: {
        
                        memberAddChannel: channel.id,
                        memberRemoveChannel: channel.id
                    }
                })
            }

            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))

                .setTitle(`🔧 | Configuration`)
                .setDescription(`
                **Mise à jour d'un salon :**

                **Salon :** <#${channel.id}>
                **Evenement :** \`${newEvent}\``)

            await message.reply({embeds: [Embed] })

            return "updateChannel ▬ ✅"
        }



        async function verif() {

            await mongoose.connect('mongodb+srv://AsheTheBot:F9J8OJApmOqXv5xV@ashe.hprndkb.mongodb.net/Ashe')

            let statut = true
            indexNumber = 0
            
            Guilds.findOne({guildID: message.guild.id}, (error, data) => {

                if (data === null) {
    
                    message.reply("\`❌\` | Votre serveur n'est pas inscrit dans la base de données, veuillez m'exclure et m'ajouter de nouveau, si le problème persite, contacter Ashinura#2679")
                }

                else {
                    updateChannels()
                        .catch(console.error)
                        .then(console.log)
                        .finally(() => client.close()) 
                }
            })

            return "Vérification pour configChannel ▬ ✅"
        }

        verif()
            .catch(console.error)
            .then(console.log)
    }
}