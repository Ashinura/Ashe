const Discord = require('discord.js')
const { MongoClient } = require("mongodb")

const { cluster } = require("../config.json")
const client = new MongoClient(cluster)

let welcomeChannelID = "Aucun"

module.exports = ("guildMemberAdd", async (bot, member) => {

    async function memberJoin() {

        const welcomeEmbed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setAuthor({ name: 'Ashe#0121', iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('**Bienvenue 👋**')
            .setDescription(`Hey **${ member.user.tag }**, merci d'avoir rejoins **${member.guild.name}**`)
            .setThumbnail(member.displayAvatarURL({dynamic: true}))
            .setFooter({ text: `Total du serveur : ${ member.guild.memberCount } membres` })

        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id == welcomeChannelID)
    
        if (welcomeChannel != undefined) {

            welcomeChannel.send({ embeds: [welcomeEmbed]})
        }

        return "✅ ▬ memberJoin"
    }

    async function searchChannel() {

        await client.connect()

        const db = client.db("Ashe")
        const guilds_coll = db.collection('guilds')

        const guildDataBefore = await guilds_coll.findOne({guildID: member.guild.id})
        welcomeChannelID = guildDataBefore.memberAddChannel

        if (welcomeChannelID != "Aucun") {

            memberJoin()
                .catch(console.error)
                .then(console.log)
        }
    }

    searchChannel()
        .catch(console.error)
        .finally(() => client.close())
})