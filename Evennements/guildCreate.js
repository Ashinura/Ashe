const Discord = require("discord.js")
const mongoose = require('mongoose')
const { MongoClient } = require("mongodb")

const { Guilds } = require('../Database/loadModels')
const { cluster } = require("../config.json")
const client = new MongoClient(cluster)


module.exports = ("guildCreate", async (bot, guild) => {


    async function newGuild() {

        await mongoose.connect('mongodb+srv://AsheTheBot:F9J8OJApmOqXv5xV@ashe.hprndkb.mongodb.net/Ashe')
    
        const owner = await guild.fetchOwner()



        const roleName = 'Ashe'; // Remplacez par le nom du rôle que vous recherchez
        
        const botMember = guild.members.cache.get(bot.user.id); // Obtient le membre correspondant à votre bot
        const botRole = botMember.roles.highest; // Obtient le rôle le plus élevé du bot sur le serveur
        
        // Recherche du rôle par nom
        const role = guild.roles.cache.find(role => role.name === roleName);
        
        if (role) {
          const position = 1; // Mettez la position souhaitée du rôle ici
        
          // Déplacement du rôle au-dessus
          role.setPosition(position)
            .then((updatedRole) => {
              console.log(`Le rôle ${updatedRole.name} a été déplacé en haut.`);
        
              // Vérification si le rôle du bot doit être déplacé au-dessus
              if (botRole && botRole.position > position) {
                    botRole.setPosition(position)
                    .then((updatedBotRole) => {
                        console.log(`Le rôle du bot ${updatedBotRole.name} a été déplacé en haut.`);
                    })
                    .catch((error) => {
                        console.error('Une erreur est survenue lors du déplacement du rôle du bot :', error);
                    });
                }
            })
            .catch((error) => {
                console.error('Une erreur est survenue lors du déplacement du rôle :', error);
            });
        } 
        
        else {
          console.log(`Le rôle "${roleName}" n'a pas été trouvé sur le serveur.`);
        }

      
        const Guild = new Guilds({

            guildName: guild.name,
    
            Informations: {

                ownerID: owner.user.id,
                ownerName: owner.user.tag,
                guildID: guild.id,
                guildMembers: guild.members.cache.size,
            },

            Configuration: {

                memberAddChannel: "Aucun",
                memberRemoveChannel: "Aucun"
            }
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

            newGuild()
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