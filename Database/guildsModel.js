const mongoose = require("mongoose");


const GuildsSchema = mongoose.Schema({

    guildName: {
        type: String,
        required: true,
        validate(v) { if (v < 0) throw new Error("guildName n'est pas déclarer") } 
    },

    Informations: {

        ownerID: {
            type: String,
            required: true,
            validate(v) { if (v < 0) throw new Error("ownerID n'est pas déclarer") }   
        },

        ownerName: {
            type: String,
            required: true,
            validate(v) { if (v < 0) throw new Error("ownerID n'est pas déclarer") }   
        },
    
        guildID: {
            type: String,
            required: true,
            validate(v) { if (v < 0) throw new Error("guildID n'est pas déclarer") } 
        },
    
        guildMembers: {
            type: Number,
            required: true,
            validate(v) { if (v < 0) throw new Error("guildMembers n'est pas déclarer") } 
        }
    }, 

    Configuration: {

        memberAddChannel: {
            type: String,
            required: true,
            validate(v) { if (v < 0) throw new Error(" memberAddChannel n'est pas déclarer") } 
        },
    
        memberRemoveChannel: {
            type: String,
            required: true,
            validate(v) { if (v < 0) throw new Error("memberRemoveChannel n'est pas déclarer") } 
        }    
    }
})

module.exports = mongoose.model('Guilds', GuildsSchema)