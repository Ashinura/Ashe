const Discord = require("discord.js")
const ms = require("ms")

const { MongoClient } = require("mongodb")
const mongoose = require("mongoose")

const { Report } = require('../../Database/loadModels')
const { cluster } = require("../../config.json")
const client = new MongoClient(cluster)


module.exports = {

    name: "report",
    description: "Report un membre",
    permission: Discord.PermissionFlagsBits.ModerateMembers,
    category: "Modération",
    dm: false,
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre à report",
            required: true,
            autocomplete: false
        }, 
        {
            type: "string",
            name: "raison",
            description: "La raison du report", 
            required: true,
            autocomplete: false
        },
        {
            type: "string",
            name: "notification",
            description: "Est ce que le membre reçoit une notification en MP, 'Oui' par défaut", 
            required: false,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {
        
        let user = args.getUser("membre")
        if (!user) return message.reply("\`❗\` | Pas de membre à report")

        let member = message.guild.members.cache.get(user.id)
        if (!member) return message.reply("\`❗ |\` Pas de membre à report")

        let modoReason = args.getString("raison")
        if (!modoReason) { modoReason = "Aucune raison fournie."}

        let notif = args.getString("notification")
        if (!notif) notif = 'Non'

        if (message.user.id === user.id) return message.reply("\`❌\` | Tu ne peux pas te report")
        if (bot.user.id === user.id) return message.reply("\`❌\` | Tu ne peux pas me report :)")
        if ( (await message.guild.fetchOwner()).id === user.id) return message.reply("\`❌\` | Tu ne peux pas report le propriétaire de ce serveur")
        if (member && message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) return message.reply("\`❌\` | Ce membre est supérieur à toi")

        const db = client.db("Ashe")
        const reports_coll = db.collection('reports')
        let indexNumber = 0
        let save = undefined

        const Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))

            .setTitle(`\`📝\` | Quelqu'un à été report`)
            .setDescription(`${message.user} a report : \`${user.tag}\`   \n\n**Raison : **\`${modoReason}\`\n**Notification : **\`${notif}\``)
        

        
        async function newGuild() {

            await mongoose.connect(cluster)

            const Reports = new Report({
                
                serverName: message.guild.name,
                serverID: message.guild.id,
                users: [{

                    userTag: user.tag,
                    userID: user.id,
                    reason: [modoReason],
                    count: 1
                }]
            })

            Reports.save()

            await message.reply({embeds: [Embed] })

            return "✅ ▬ newGuildReport"
        }



        async function newUser() {

            Report.findOneAndUpdate({ serverID: message.guild.id }, { 
                
                $push: { 
                    users: { 
                        userTag: user.tag, 
                        userID: user.id, 
                        reason: [modoReason], 
                        count: 1 
                    } 
        
                }}, (error, data) => {
            
                    save = data
                }
            )
            
            await message.reply({embeds: [Embed] })

            return "✅ ▬ newUserReport"
        }


        
        async function updateUser() {

            Report.findOne({serverID: message.guild.id}, async(error, data) => {

                const getUserID = data.users[indexNumber].userID
                const getCount = data.users[indexNumber].count
                const newCount = getCount + 1
                
                if (getCount >= 3 || newCount == 3) {

                    let time = '7d'
                    let result = time.indexOf("d")
                    let durée = "Not found"

                    if (result != -1) { durée = time.replace("d", " jours") }

                    member.timeout(ms(time))
                    console.log('✅ ▬ TimeOutReport')

                    Report.findOneAndUpdate({ serverID: message.guild.id }, { 
                
                        $pull: { 
                            users: { 
                                userID: user.id, 
                            } 
                
                        }}, (error, data) => {
                    
                            save = data
                        }
                    )

                    if (notif == 'Oui') {

                        const notifuser = new Discord.EmbedBuilder()
                        .setColor(bot.color)
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    
                        .setTitle(`\`🤐\` | Tu as été time-out`)
                        .setDescription(`Tu as été mute de \`${message.guild.name}\`   \n\n**Durée :** \`${durée}\`\n**Raison :** \`${modoReason}\``)
            
                        try {user.send({embeds: [notifuser]})} catch(err) {}
                    }

                    const EmbedTO = new Discord.EmbedBuilder()
                        .setColor(bot.color)
                        .setThumbnail(message.guild.iconURL({ dynamic: true }))

                        .setTitle(`\`🤐\` | Quelqu'un à été time-out suite à son troisième report`)
                        .setDescription(`Membre : \`${user.tag}\`   \n\n**Durée :** \`${durée}\`\n**Raison : **\`${modoReason}\`\n**Notification : **\`${notif}\``)

                    await message.reply({embeds: [EmbedTO] })

                    deleteEmptyUsers()
                }
                

                else {

                    Report.findOneAndUpdate({ serverID: message.guild.id, "users.userID": user.id }, { 

                        $set: { "users.$.count": newCount }, 
                        $push: { "users.$.reason": modoReason }

                    }, (error, data) => {
            
                        save = data
                    })

                    await message.reply({embeds: [Embed] })
                }
            })

            return "✅ ▬ updateUserReport"
        }





        async function deleteEmptyUsers() {

            await mongoose.connect(cluster)
        
            Report.deleteMany({ users: [] }, (error, result) => {
                
                if (result.deletedCount != 0 ) { 

                    console.log("✅ ▬ deleteEmptyUsers")
                }
            })
              
        }





        async function verif() {

            await mongoose.connect(cluster)

            deleteEmptyUsers()

            let statut = true
            indexNumber = 0
            
            
            Report.findOne({serverID: message.guild.id}, (error, data) => {

                if (data === null) {
    
                    newGuild()
                        .catch(console.error)
                        .then(console.log)
                }

                else {

                    while (indexNumber < data.users.length && statut == true) {
        
                        const getUserID = data.users[indexNumber].userID

                        if (data.users == null) console.log("💬 ▬ Vérification pour report")
    
                        if (getUserID === user.id) {
                        
                            updateUser()
                                .catch(console.error)
                                .then(console.log)
                        
                            statut = false
                        }
    
                        else indexNumber++
                    } 

                    if (indexNumber == data.users.length) {

                        newUser()
                            .catch(console.error)
                            .then(console.log)
                    }
                }
            })

            return "✅ ▬ Vérification pour report"
        }





        verif()
            .catch(console.error)
            .then(console.log)


        if (notif == 'Oui') {

            const notifuser = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        
            .setTitle(`\`📝\` | Tu as été report`)
            .setDescription(`Tu as été report de \`${message.guild.name}\` par ${message.user.tag}  \n\nRaison : \`${modoReason}\``)

            try {await user.send({embeds: [notifuser]})} catch(err) {}
        }
    }
}