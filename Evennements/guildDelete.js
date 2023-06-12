const Discord = require("discord.js")
const { MongoClient } = require("mongodb")
const client = new MongoClient('mongodb+srv://AsheTheBot:F9J8OJApmOqXv5xV@ashe.hprndkb.mongodb.net/Ashe')

module.exports = ("guildDelete", async (bot, guild) => {
    
    async function main() {

        await client.connect()

        const db = client.db("Ashe")
        const guilds_coll = db.collection('guilds')
    
        await guilds_coll.findOneAndDelete({guildID: guild.id})
     
        return "guildDelete ▬ ✅"
    }

    main()
        .catch(console.error)
        .then(console.log)
        .finally(() => client.close())
})