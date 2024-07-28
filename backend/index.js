
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file

const seedDatabase = require("./controllers/seedDatabase");
const transactionsController = require("./controllers/transactionsController");
const statisticsController = require("./controllers/statisticsController");
const barChartController = require("./controllers/barChartController");
const pieChartController = require("./controllers/pieChartController");
const combinedResponseController = require("./controllers/combinedResponseController");

const app = express();
app.use(cors());
app.use(express.json());




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



  mongoose.connect(process.env.DATABASE_URL, {})
    .then(() => {
      console.log('Connected to MongoDB!');
    })
    .catch((err) => {
      console.error(err);
    });

seedDatabase();

app.get("/transactions", transactionsController);
app.get("/statistics", statisticsController);
app.get("/bar-chart", barChartController);
app.get("/pie-chart", pieChartController);
app.get("/combined-response", combinedResponseController);

