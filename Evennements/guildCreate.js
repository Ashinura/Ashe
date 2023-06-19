const Discord = require("discord.js")
const mongoose = require('mongoose')
const { MongoClient } = require("mongodb")

const { Guilds } = require('../Database/loadModels')
const { cluster } = require("../config.json")
const client = new MongoClient(cluster)


module.exports = ("guildCreate", async (bot, guild) => {


    async function main() {

        await mongoose.connect('mongodb+srv://AsheTheBot:F9J8OJApmOqXv5xV@ashe.hprndkb.mongodb.net/Ashe')
    
        const owner = await guild.fetchOwner()  
        const OwnerID = owner.user.id
        
        const Guild = new Guilds({
    
            ownerID: OwnerID,
            guildID: guild.id,
            guildName: guild.name,
            guildMembers: guild.members.cache.size,
            memberAddChannel: "Aucun",
            memberRemoveChannel: "Aucun"
        })

        Guild.save()

        return "✅ ▬ guildCreate"
    }

    async function verif() {

        await client.connect()

        const db = client.db("Ashe")
        const guilds_coll = db.collection('guilds')

        const guild_ID = await guilds_coll.findOne({guildID: guild.id})

        if (guild_ID === null) {

            main()
                .catch(console.error)
                .then(console.log)
        }

        else {

            console.log(`Serveur déjà présent : ${guild.name} ▬ ✅`)
        }

        return "✅ ▬ Vérification pour guildCreate"
    }

    verif()
        .catch(console.error)
        .then(console.log)
        .finally(() => client.close())
})