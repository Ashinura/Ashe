const Discord = require("discord.js")
const { MongoClient } = require("mongodb")

const { cluster } = require("../config.json")
const client = new MongoClient(cluster)


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