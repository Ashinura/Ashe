const Discord = require("discord.js")

const { MongoClient } = require("mongodb")
const mongoose = require("mongoose")

const { Report } = require('../../Database/loadModels')
const { cluster } = require("../../config.json")


module.exports = {

    name: "userreport",
    description: "Permet d'avoir des informations sur le report d'un utilisateur",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    category: "Information",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre dont vous voulez voir les reports",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {



        async function userReport(indexNumber, data) {
            
            let user = args.getUser("membre")
            if (!user) return message.reply("\`❗\` | Aucun utilisateur trouvé")

            const usertag = data.users[indexNumber].userTag
            const reasons = []
            const count = data.users[indexNumber].count
            const tag = usertag.replace(/#0/g, "");

            for(let i=0; i<data.users[indexNumber].count; i++) {

                reasons.push(data.users[indexNumber].reason[i])
            }
            const Embed_1 = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(user.displayAvatarURL({dynamic: true}))

                .setTitle(`\`🛡️\` | Voici les reports de l'utilisateur`)
                .setDescription(`
                    **Utilisateur :** \`${tag}\`
                    **Nombre de reports :** \`${count}\`

                    Raison : \`${reasons[0]}\`
                `)


            const Embed_2 = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(user.displayAvatarURL({dynamic: true}))

                .setTitle(`\`🛡️\` | Voici les reports de l'utilisateur`)
                .setDescription(`
                    **Utilisateur :** \`${tag}\`
                    **Nombre de reports :** \`${count}\`

                    Première raison : \`${reasons[0]}\`
                    Seconde raison : \`${reasons[1]}\`
                `)


            const Embed_3 = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(user.displayAvatarURL({dynamic: true}))

                .setTitle(`\`🛡️\` | Voici les reports de l'utilisateur`)
                .setDescription(`
                    **Utilisateur :** \`${tag}\`
                    **Nombre de reports :** \`${count}\`

                    Première raison : \`${reasons[0]}\`
                    Seconde raison : \`${reasons[1]}\`
                    Troisième raison : \`${reasons[2]}\`
                `)

            switch (count) {

                case (1):
                    await message.reply({embeds: [Embed_1] })
                    break

                case (2):
                    await message.reply({embeds: [Embed_2] })
                    break

                case (3):
                    await message.reply({embeds: [Embed_3] })
                    break

                default:
                    message.reply("\`❌\` | Une erreur est survenue")
              }
        }
        


        async function verif() {

            await mongoose.connect(cluster)

            let user = args.getUser("membre")
            if (!user) return message.reply("\`❗\` | Aucun utilisateur trouvé")

            let statut = true
            indexNumber = 0
            
            Report.findOne({serverID: message.guild.id}, (error, data) => {

                if (data === null) {
    
                    message.reply("\`❌\` | Aucuns reports a été déclarés dans ce serveur")
                }

                else {

                    while (indexNumber < data.users.length && statut == true) {
        
                        const getUserID = data.users[indexNumber].userID

                        if (data.users == null) {

                            message.reply("\`❌\` | Une erreur s'est produite")
                        }
    
                        if (getUserID === user.id) {
                        
                            userReport(indexNumber, data)
                            statut = false
                        }
    
                        else indexNumber++
                    } 

                    if (indexNumber == data.users.length) {

                        message.reply("\`❗\` | Cet utilisateur n'a aucun reports")
                    }
                }
            })

            return "Vérification pour report ▬ ✅"
        }

        verif()
    }
}