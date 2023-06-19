const Discord = require("discord.js")


module.exports = {

    name: "help",
    description: "Donne les commandes du bot",
    permission: "Aucune",
    dm: true,
    options: [
        {
            type: "string",
            name: "commande",
            description: "Le nom de la commande à afficher",
            required: false,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {

        let command

        if (args.getString("commande")) {

            command = bot.commands.get(args.getString("commande"))
            if(!command) return message.reply('\`❌\` | Aucune commande trouvée')
        }

        if (!command) {

            let categories = []

            bot.commands.forEach(command => {

                if(!categories.includes(command.category)) categories.push(command.category)
            })

            const Embed = new Discord.EmbedBuilder()
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setColor(bot.color)

                .setTitle("Voici la liste de mes commandes :")
                .setFooter({ text: `Pour en savoir plus sur une commande précise, fait /help <commande>`})
                .setDescription(`
                **🤖・Utile**

                》 **/help**
                》 **/ping**
                》 **/link**
                》 **/configchannel**


                **📜・Information**
                
                》 **/servinfo**
                》 **/userinfo**
                》 **/getowner**

                **🔧・Modération** 

                》 **/clear**
                》 **/report**
                》 **/kick**
                》 **/ban**
                》 **/unban**
                》 **/timeout**
                》 **/rmtimeout**
                》 **/lock**
                》 **/unlock**


                **🕹️・Jeux**

                》 **/pfc**
                》 **/say**`)

            

            message.reply({embeds: [Embed] })
        }

        else {  

            const Embed = new Discord.EmbedBuilder()
                .setColor(bot.color)
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))

                .setTitle(`Précision sur la commande ${command.name}`)
                .setDescription(`**Nom** : \`${command.name}\`
                **Description** : \`${command.description}\`
                **Catégorie** : \`${command.category}\`
                **Permission** : \`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`
                \n**DM** : \`${command.dm ? "Oui" : "Non"}\``)

            message.reply({embeds: [Embed]})
        }
    }   
}