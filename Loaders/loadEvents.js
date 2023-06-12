const fs = require("fs")

module.exports = async(bot) => {

    async function events() {

        fs.readdirSync("./Evennements").filter(f => f.endsWith(".js")).forEach(async file => {

            let event = require(`../Evennements/${file}`)
            bot.on(file.split(".js").join(""), event.bind(null, bot))
        })

        return "Evennements ▬ ✅"
    }

    events()
        .catch(console.error)
        .then(console.log)
}