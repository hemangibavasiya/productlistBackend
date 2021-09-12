const router = require('express').Router()
const status  = require('http-status')
const { getProductList, getFilterList } = require('../services/product')

router.get('/list', async (req, res) => {
    try {
        const response = await getProductList()
        res.status(status.OK).send(response)
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
})

router.post('/list/filter', async (req, res) => {
    try {
        const response = await getFilterList(req.body)
        res.status(status.OK).send(response)
    } catch (error) {
        if (error.status) res.status(error.status).send({"error_message": error.message})
        res.status(status.INTERNAL_SERVER_ERROR).send({"error_message": error})
    }
})

module.exports = router