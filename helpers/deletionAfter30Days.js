const cron = require('node-cron');
const deleteOldProducts = require('../controller/Product/ProductOperation').deleteOldProducts;

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', deleteOldProducts);
