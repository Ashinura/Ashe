const Discord = require("discord.js")
const { MongoClient } = require("mongodb")

const { cluster } = require("../config.json")
const client = new MongoClient(cluster)


module.exports = ("guildDelete", async (bot, guild) => {
    
    async function guildDelete() {

        await client.connect()

        const db = client.db("Ashe")
        const guilds_coll = db.collection('guilds')
    
        await guilds_coll.findOneAndDelete({'Informations.guildID': guild.id})
     
        return "✅ ▬ guildDelete"
    }

    guildDelete()
        .catch(console.error)
        .then(console.log)
        .finally(() => client.close())
})