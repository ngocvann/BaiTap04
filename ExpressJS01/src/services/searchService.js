const client = require("../config/elastic");

async function searchProducts(query) {
  const {
    name,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 10,
  } = query;

  const esQuery = {
    bool: {
      must: [],
      filter: [],
    },
  };

  // 🔍 FUZZY SEARCH
  if (name) {
    esQuery.bool.must.push({
      match: {
        name: {
          query: name,
          fuzziness: "AUTO", // tìm gần đúng
        },
      },
    });
  }

  // 📁 LỌC CATEGORY
  if (category) {
    esQuery.bool.filter.push({ term: { category } });
  }

  // 💰 LỌC GIÁ
  if (minPrice || maxPrice) {
    esQuery.bool.filter.push({
      range: {
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
      },
    });
  }

  // 📄 PHÂN TRANG
  const from = (page - 1) * limit;

  // 🔄 SẮP XẾP
  const sortOption = sort
    ? [
        {
          [sort.replace("-", "")]: {
            order: sort.startsWith("-") ? "desc" : "asc",
          },
        },
      ]
    : [{ createdAt: { order: "desc" } }];

  const result = await client.search({
    index: "products",
    from,
    size: limit,
    query: esQuery,
    sort: sortOption,
  });

  const total = result.hits.total.value;
  const items = result.hits.hits.map((hit) => hit._source);

  return {
    total,
    pages: Math.ceil(total / limit),
    items,
  };
}

module.exports = { searchProducts };
