const mongoose = require("mongoose");


const GuildReportModel = mongoose.Schema({

    serverName: {
        type: String,
        required: true,
        validate(v) { if (v < 0) throw new Error("serverID n'est pas déclarer") }   
    },

    serverID: {
        type: String,
        required: true,
        validate(v) { if (v < 0) throw new Error("serverID n'est pas déclarer") }   
    },

    users: [{

        userTag: String,
        userID: String,
        reason: [String],
        count: Number
    }]
})

module.exports = mongoose.model('Report', GuildReportModel)