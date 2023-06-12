const Discord = require('discord.js')
const { MongoClient } = require("mongodb")

const { cluster } = require("../config.json")
const client = new MongoClient(cluster)

let goodbyeChannelID = "Aucun"


module.exports = ("guildMemberRemove", async (bot, member) => {

    async function memberLeave() {

        const goodbyeEmbed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setAuthor({ name: 'Ashe#0121', iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
            .setTitle('**Au revoir 👋**')
            .setDescription(`Ho, **${ member.user.tag }** est malheuresement parti du serveur`)
            .setThumbnail(member.displayAvatarURL({dynamic: true}))
            .setFooter({ text: `Total du serveur : ${ member.guild.memberCount } membres` })

        const goodbyeChannel = member.guild.channels.cache.find(channel => channel.id == goodbyeChannelID)
    
        if (goodbyeChannel != undefined) {

            goodbyeChannel.send({ embeds: [goodbyeEmbed]})
        }

        return "memberLeave ▬ ✅"
    }

    async function searchChannel() {

        await client.connect()

        const db = client.db("Ashe")
        const guilds_coll = db.collection('guilds')

        const guildDataBefore = await guilds_coll.findOne({guildID: member.guild.id})
        goodbyeChannelID = guildDataBefore.memberRemoveChannel

        if (goodbyeChannelID != "Aucun") {

            memberLeave()
                .catch(console.error)
                .then(console.log)
        }

        return "searchChannel ▬ ✅"
    }

    searchChannel()
        .catch(console.error)
        .then(console.log)
        .finally(() => client.close())
})