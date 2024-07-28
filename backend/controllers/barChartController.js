
const Product = require("../models/Product");

const barChartController = async (req, res) => {
  try {
    const selectedMonth = req.query.month || 'march';

    const monthMap = {
      'january': 1,
      'february': 2,
      'march': 3,
      'april': 4,
      'may': 5,
      'june': 6,
      'july': 7,
      'august': 8,
      'september': 9,
      'october': 10,
      'november': 11,
      'december': 12,
    };

    const numericMonth = monthMap[selectedMonth.toLowerCase()];

    const priceRanges = [
      { range: '0 - 100', min: 0, max: 100 },
      { range: '101 - 200', min: 101, max: 200 },
      { range: '201 - 300', min: 201, max: 300 },
      { range: '301 - 400', min: 301, max: 400 },
      { range: '401 - 500', min: 401, max: 500 },
      { range: '501 - 600', min: 501, max: 600 },
      { range: '601 - 700', min: 601, max: 700 },
      { range: '701 - 800', min: 701, max: 800 },
      { range: '801 - 900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Number.MAX_VALUE },
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Product.aggregate([
          {
            $match: {
              $expr: { $eq: [{ $month: "$dateOfSale" }, numericMonth] },
              price: { $gte: range.min, $lt: range.max },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ]);

        return { priceRange: range.range, itemCount: count[0] ? count[0].count : 0 };
      })
    );

    res.json(barChartData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = barChartController;
