const fs = require("fs")

module.exports = async(bot) => {

    async function commands() {

        fs.readdirSync("./Commandes/Information/").filter(f => f.endsWith(".js")).forEach(async file => {

            let command = require(`../Commandes/Information/${file}`)
    
            if (!command.name || typeof command.name !== "string") throw new TypeError(`La commande ${file} n'as pas de nom !`)
    
            bot.commands.set(command.name, command)
            
        })

        fs.readdirSync("./Commandes/Jeux").filter(f => f.endsWith(".js")).forEach(async file => {

            let command = require(`../Commandes/Jeux/${file}`)
    
            if (!command.name || typeof command.name !== "string") throw new TypeError(`La commande ${file} n'as pas de nom !`)
    
            bot.commands.set(command.name, command)
            
        })

        fs.readdirSync("./Commandes/Moderation").filter(f => f.endsWith(".js")).forEach(async file => {

            let command = require(`../Commandes/Moderation/${file}`)

            if (!command.name || typeof command.name !== "string") throw new TypeError(`La commande ${file} n'as pas de nom !`)
    
            bot.commands.set(command.name, command)
            
        })

        fs.readdirSync("./Commandes/Utile").filter(f => f.endsWith(".js")).forEach(async file => {

            let command = require(`../Commandes/Utile/${file}`)
        
    
            if (!command.name || typeof command.name !== "string") throw new TypeError(`La commande ${file} n'as pas de nom !`)
    
            bot.commands.set(command.name, command)
            
        })

        return "Commandes ▬ ✅"
    }

    commands()
        .catch(console.error)
        .then(console.log)
}