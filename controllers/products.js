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

    console.log(sqlQuery)
    const products = await db.query(sqlQuery, sqlReq)

    res.status(200).json({ data: products.rows, nbHits: products.rows.length });
};

const getAllProducts = async (req, res) => {
    res.status(200).json({ msg: "products route" });
};


// const getAllProductsStatic = async (req, res) => {
//   const products = await Product.find({ price: { $gt: 30 } })
//     .sort('price')
//     .select('name price');

//   res.status(200).json({ products, nbHits: products.length });
// };

// const getAllProducts = async (req, res) => {
//   const { featured, company, name, sort, fields, numericFilters } = req.query;
//   const queryObject = {};

//   if (featured) {
//     queryObject.featured = featured === 'true' ? true : false;
//   }
//   if (company) {
//     queryObject.company = company;
//   }
//   if (name) {
//     queryObject.name = { $regex: name, $options: 'i' };
//   }
//   if (numericFilters) {
//     const operatorMap = {
//       '>': '$gt',
//       '>=': '$gte',
//       '=': '$eq',
//       '<': '$lt',
//       '<=': '$lte',
//     };
//     const regEx = /\b(<|>|>=|=|<|<=)\b/g;
//     let filters = numericFilters.replace(
//       regEx,
//       (match) => `-${operatorMap[match]}-`
//     );
//     const options = ['price', 'rating'];
//     filters = filters.split(',').forEach((item) => {
//       const [field, operator, value] = item.split('-');
//       if (options.includes(field)) {
//         queryObject[field] = { [operator]: Number(value) };
//       }
//     });
//   }

//   let result = Product.find(queryObject);
//   // sort
//   if (sort) {
//     const sortList = sort.split(',').join(' ');
//     result = result.sort(sortList);
//   } else {
//     result = result.sort('createdAt');
//   }

//   if (fields) {
//     const fieldsList = fields.split(',').join(' ');
//     result = result.select(fieldsList);
//   }
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   result = result.skip(skip).limit(limit);
//   // 23
//   // 4 7 7 7 2

//   const products = await result;
//   res.status(200).json({ products, nbHits: products.length });
// };

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
