const { getProductsWithFilter } = require("../services/productService");

const getProducts = async (req, res) => {
  try {
    const data = await getProductsWithFilter(req.query);

    return res.status(200).json({
      message: "Success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { getProducts };
