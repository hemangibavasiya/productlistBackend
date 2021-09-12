const dbCon = require('../constants/dbCon')
const { getDataWithAggregate } = require('../repository/commonRepo')

const getProductList = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = await generateQuery()
            const finalData = await getDataWithAggregate(query, dbCon.COLLECTION_PRODUCT)
            return resolve(finalData)
        } 
        catch (error) {
            return reject(error)
        }
    })
}

function generateQuery() {
    const query = []
    const lookup = {}
    lookup['$lookup'] = {}
    lookup['$lookup']['from'] = dbCon.COLLECTION_RATE
    lookup['$lookup']['let'] = { 'id': '$productId'}
    lookup['$lookup']['pipeline'] = []
    const match = {}
    match['$match'] = {}
    match['$match']['$expr'] = {}
    match['$match']['$expr']['$eq'] =  ['$productId', '$$id']
    const projectionpipeline = {}
    projectionpipeline['$project'] = {}
    projectionpipeline['$project']['_id'] = 0
    projectionpipeline['$project']['rate'] = 1
    lookup['$lookup']['as'] = 'rating_details'
    const unwind = {}
    unwind['$unwind'] = {}
    unwind['$unwind']['path'] = '$rating_details'
    const group = {}
    group['$group'] = {}
    group['$group']['_id'] = {}
    group['$group']['_id']['productId'] = '$productId'
    group['$group']['_id']['title'] = '$title'
    group['$group']['_id']['description'] = '$description'
    group['$group']['_id']['price'] = '$price'
    group['$group']['_id']['discount'] = '$discount'
    group['$group']['totalData'] = { }
    group['$group']['totalData']['$sum'] = 1
    group['$group']['rating'] = {}
    group['$group']['rating']['$avg'] = '$rating_details.rate'
    const projection = {}
    projection['$project'] = {}
    projection['$project']['title'] = '$_id.title'
    projection['$project']['description'] = '$_id.description'
    projection['$project']['price'] = '$_id.price'
    projection['$project']['discount'] = '$_id.discount'
    projection['$project']['rating'] = 1
    projection['$project']['_id'] = 0
    lookup['$lookup']['pipeline'].push(match)
    lookup['$lookup']['pipeline'].push(projectionpipeline)
    query.push(lookup)
    query.push(unwind)
    query.push(group)
    query.push(projection)
    return query
}

const getFilterList = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = await generateFilterQuery(body)
            const finalData = await getDataWithAggregate(query, dbCon.COLLECTION_PRODUCT)
            return resolve(finalData)
        } 
        catch (error) {
            return reject(error)
        }
    })
}

function generateFilterQuery (body) {
    const query = []
    const lookup = {}
    lookup['$lookup'] = {}
    lookup['$lookup']['from'] = dbCon.COLLECTION_RATE
    lookup['$lookup']['let'] = { 'id': '$productId'}
    lookup['$lookup']['pipeline'] = []
    const match = {}
    match['$match'] = {}
    match['$match']['$expr'] = {}
    match['$match']['$expr']['$eq'] =  ['$productId', '$$id']
    const projectionpipeline = {}
    projectionpipeline['$project'] = {}
    projectionpipeline['$project']['_id'] = 0
    projectionpipeline['$project']['rate'] = 1
    lookup['$lookup']['as'] = 'rating_details'
    const unwind = {}
    unwind['$unwind'] = {}
    unwind['$unwind']['path'] = '$rating_details'
    const group = {}
    group['$group'] = {}
    group['$group']['_id'] = {}
    group['$group']['_id']['productId'] = '$productId'
    group['$group']['_id']['title'] = '$title'
    group['$group']['_id']['description'] = '$description'
    group['$group']['_id']['price'] = '$price'
    group['$group']['_id']['discount'] = '$discount'
    group['$group']['totalData'] = { }
    group['$group']['totalData']['$sum'] = 1
    group['$group']['rating'] = {}
    group['$group']['rating']['$avg'] = '$rating_details.rate'
    const projection = {}
    projection['$project'] = {}
    projection['$project']['title'] = '$_id.title'
    projection['$project']['description'] = '$_id.description'
    projection['$project']['price'] = '$_id.price'
    projection['$project']['discount'] = '$_id.discount'
    projection['$project']['rating'] = 1
    projection['$project']['_id'] = 0
    lookup['$lookup']['pipeline'].push(match)
    lookup['$lookup']['pipeline'].push(projectionpipeline)
    query.push(lookup)
    query.push(unwind)
    query.push(group)
    query.push(projection)
    const matchFilter = {}
    matchFilter['$match'] = {}
    matchFilter['$match']['$expr'] = {}
    matchFilter['$match']['$expr']['$or'] = []
    const cond1 = {}
    cond1['$or'] = []
    const arrayCond1 = {}
    const arrayCond2 = {}
    arrayCond1['$gt'] = [ "$price", body.gtPrice ]
    arrayCond2['$lt'] = [ "$price", body.ltPrice ]
    cond1['$or'].push(arrayCond1)
    cond1['$or'].push(arrayCond2)

    const cond2 = {}
    cond2['$eq'] = [ "$rating", body.rate ]
    const cond3 = {}
    cond3['$eq'] = [ "$title", body.title ]
    matchFilter['$match']['$expr']['$or'].push(cond1)
    matchFilter['$match']['$expr']['$or'].push(cond2)
    matchFilter['$match']['$expr']['$or'].push(cond3)
    query.push(matchFilter)
    return query
}

module.exports = {
    getProductList,
    getFilterList
}