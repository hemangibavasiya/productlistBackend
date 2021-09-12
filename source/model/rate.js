const mongoose = require('mongoose')
const dbCon = require('../constants/dbCon')

const productRateSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    productId: {
        type: Number,
        required: true      
    },
    rate: {
        type: Number,
        required: true      
    }
}, {
    collection:dbCon.COLLECTION_RATE
})

productRateSchema.plugin(global.db.autoIncrement.plugin, {
    model: dbCon.COLLECTION_RATE,
    field: 'rateId',
    startAt: 1
})
module.exports = global.db.connection.model(dbCon.COLLECTION_RATE, productRateSchema)