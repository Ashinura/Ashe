const Discord = require('discord.js')

module.exports = {

    name: 'pfc',
    description: 'Jouer au fameux pierre, feuille, ciseaux avec moi 😄',
    permission: 'Aucune',
    category: 'Jeux',
    dm: true,
    options: [
        {
            type: "string",
            name: "choix",
            description: "Auras tu de la chance ?",
            required: true,
            autocomplete: true
        }
    ],

    async run(bot, message, args) {

        const choix_bot = ["Pierre", "Feuille", "Ciseau"]
        const random = Math.floor(Math.random() * 3)
        const result = choix_bot[random];
        const choix = args.getString("choix")      
        
        if (choix === "Ciseau" & result === "Ciseau") {
            message.reply(`\`\`\`🔪 | Votre choix : Ciseau,\n🔪 | Mon choix : ${result}. \n\n🟨 | Egalité !\`\`\``)
        }
        
        if (choix === "Pierre" & result === "Pierre") {
            message.reply(`\`\`\`🧱 | Votre choix : Pierre,\n🧱 | Mon choix : ${result}. \n\n🟨 | Egalité !\`\`\``)
        }
        
        if (choix === "Feuille" & result === "Feuille") {
            message.reply(`\`\`\`🌿 | Votre choix : Feuille,\n🌿 | Mon choix : ${result}.  \n\n🟨 | Egalité !\`\`\``)
        }

        if (choix === "Feuille" & result === "Ciseau") {
            message.reply(`\`\`\`🌿 | Votre choix : Feuille,\n🔪 | Mon choix : ${result}. \n\n🟥 | J'ai gagné !\`\`\``)
        }
        
        if (choix === "Ciseau" & result === "Pierre") {
            message.reply(`\`\`\`🔪 | Votre choix : Ciseau,\n🧱 | Mon choix : ${result}. \n\n🟥 | J'ai gagné !\`\`\``)
        }
        
        if (choix === "Pierre" & result === "Feuille") {
            message.reply(`\`\`\`🧱 | Votre choix : Pierre,\n🌿 | Mon choix : ${result}. \n\n🟥 | J'ai gagné !\`\`\``)
        }
        
        if (choix === "Feuille" & result === "Pierre") {
            message.reply(`\`\`\`🌿 | Votre choix : Feuille,\n🧱 | Mon choix : ${result}. \n\n🟩 | Tu as gagné !\`\`\``)
        }
        
        if (choix === "Pierre" & result === "Ciseau") {
            message.reply(`\`\`\`🧱 | Votre choix : Pierre,\n🔪 | Mon choix : ${result}. \n\n🟩 | Tu as gagné\`\`\``)
        }
        
        if (choix === "Ciseau" & result === "Feuille") {
            message.reply(`\`\`\`🔪 | Votre choix : Ciseau,\n🌿 | Mon choix : ${result}. \n\n🟩 | Tu as gagné !\`\`\``)
        }
    }
}