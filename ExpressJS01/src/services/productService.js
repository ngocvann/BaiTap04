const { Op } = require("sequelize");
const Product = require("../models/Product");

const getProductsWithFilter = async (queryString) => {
  const { page, limit, name, category, minPrice, maxPrice, sort } = queryString;

  let whereClause = {};

  // fuzzy search
  if (name) {
    whereClause.name = { [Op.like]: `%${name}%` };
  }

  // loc theo danh muc
  if (category) {
    whereClause.category = category;
  }

  // loc theo khoang gia
  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
    if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
  }

  // phan trang
  const currentLimit = Number(limit) || 10;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * currentLimit;

  //sap xep
  let orderClause = [["createdAt", "DESC"]];

  if (sort) {
    const isDesc = sort.startsWith("-");
    const field = isDesc ? sort.substring(1) : sort;
    const direction = isDesc ? "DESC" : "ASC";

    const allowedSortFields = ["price", "views", "createAt", "name"];
    if (allowedSortFields.includes(field)) {
      orderClause = [[field, direction]];
    }
  }

  const { count, rows } = await Product.findAndCountAll({
    where: whereClause,
    limit: currentLimit,
    offset: offset,
    order: orderClause,
    raw: true,
  });

  return {
    meta: {
      current: currentPage,
      pageSize: currentLimit,
      pages: Math.ceil(count / currentLimit),
      total: count,
    },
    result: rows,
  };
};

module.exports = { getProductsWithFilter };
