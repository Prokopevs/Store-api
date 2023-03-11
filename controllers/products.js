const db = require('../db/connect')

const getAllProductsStatic = async (req, res) => {
    const {product_featured, product_company_name} = req.query
    let sqlQuery = `SELECT * FROM products`
    let sqlReq = []

    if(product_featured && product_company_name) {
        sqlQuery = sqlQuery + ` WHERE product_featured = $1 AND product_company_name = $2`
        sqlReq = [product_featured, product_company_name]
    } else if(product_featured) {
        sqlQuery = sqlQuery + ` WHERE product_featured = $1`
        sqlReq = [product_featured]
    } else if(product_company_name) {
        sqlQuery = sqlQuery + ` WHERE product_company_name = $2`
        sqlReq = [product_company_name]
    }

    const products = await db.query(sqlQuery, sqlReq)
    res.status(200).json({ data: products.rows, nbHits: products.rows.length });
};

const getAllProducts = async (req, res) => {
    const { product_featured, product_company_name, product_name, product_price, sort, page, numericFilters } = req.query;
    let sqlQuery = "SELECT * FROM products WHERE "  
    let sqlReq = [] 
    let mergeStringArr = [] 
    let sortString = ""
    const limit = 3
    let paginationString = ""
 
    const SqlEqual = (queryKey, queryValue) => { 
        sqlReq = [...sqlReq, queryValue] 
        mergeStringArr = [...mergeStringArr, `${queryKey} = $${sqlReq.length}`] 
    }   
     
    const SqlBetween = (queryKey, queryValue) => { 
        const priceArr = queryValue.split("-") 
        sqlReq = [...sqlReq, ...priceArr] 
        mergeStringArr = [...mergeStringArr, `${queryKey} BETWEEN $${sqlReq.length - 1} AND $${sqlReq.length}`] 
    }   

    const SqlLike = (queryKey, queryValue) => { 
        mergeStringArr = [...mergeStringArr, `${queryKey} LIKE '%${queryValue}%'`] 
    }  

    const SqlNumericFilters = (numericFilters) => { 
        const filtersArr = numericFilters.split(",")  
        mergeStringArr = [...mergeStringArr, ...filtersArr] 
    } 

    const SqlOrderBy = (sort) => { 
        const orderType = sort[0] === "-" ? "DESC" : "ASC"
        if(orderType === "DESC") {
            sort = sort.slice(1)
        }
        sortString = ` ORDER BY ${sort} ${orderType}`
    } 

    const SqlPagination = (page) => {
        page = Number(page) || 1
        paginationString =` LIMIT ${limit} OFFSET ${limit*(page-1)}`
    } 

    
     
    if (product_featured) { 
        SqlEqual("product_featured", product_featured) 
    } 
    if (product_company_name) { 
        SqlEqual("product_company_name", product_company_name) 
    } 
    if (product_name) { 
        SqlLike("product_name", product_name) 
    } 
    if (numericFilters) {
        SqlNumericFilters(numericFilters)
    }
    if (product_price) { 
        SqlBetween("product_price", product_price) 
    } 
    if (sort) { 
        SqlOrderBy(sort) 
    } 
    SqlPagination(page) 

 
    if(mergeStringArr.length === 0) { 
        sqlQuery = "SELECT * FROM products"
    } else { 
        sqlQuery = sqlQuery + mergeStringArr.join(" AND ") 
    } 

    if(sort) {
        sqlQuery = sqlQuery + sortString
    }

    sqlQuery = sqlQuery + paginationString
    console.log(sqlQuery)
     
    const products = await db.query(sqlQuery, sqlReq)
    res.status(200).json({ data: products.rows, nbHits: products.rows.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
