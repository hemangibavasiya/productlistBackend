const mongoose = require('mongoose')
const dbCon = require('../constants/dbCon')

const productSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    title: {
        type: String,
        required: true      
    },
    description: {
        type: String,
        required: true      
    }
}, {
    collection:dbCon.COLLECTION_PRODUCT
})

productSchema.plugin(global.db.autoIncrement.plugin, {
    model: dbCon.COLLECTION_PRODUCT,
    field: 'productId',
    startAt: 1
})
module.exports = global.db.connection.model(dbCon.COLLECTION_PRODUCT, productSchema)