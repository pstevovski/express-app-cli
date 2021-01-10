## Jobs

Here you can create your CRON jobs that handle recurring tasks, for example some sort of a reminder that sends notifications to users each day at a specific time, or removing the limited discounts from products, whose discount period has expired etc.

For that, we should not rely on the inbuilt **setTimeout** or **setInterval**. Instead we should make use of a scheduler like for example **node-cron** or **agendajs**.

***If your project doesn't need any CRON jobs to handle recurring tasks, you can delete this folder.***

An example of creating a CRON job, using **node-cron**, that removes discounts from products, whose limited discounts have expired.

> **NOTE**: The example is in vanilla JavaScript. If you're using TypeScript, you probably already know what to do :)

```js

// jobs/discountedProducts.js
const cron = require("node-cron");
const DiscountsService = require("../services/DiscountsService");

const discountedProductsCRON = () => {
    return cron.schedule("0 * * * *", async() => {
        const productsOnDiscount = await DiscountsService.getProductsOnDiscount();

        // Exit if there are no ongoing discounts
        if (!productsOnDiscount || productsOnDiscount.length === 0) return;

        // Cycle trough each product whose discount has expired and add it's ID to the array
        const expiredDiscounts = [];
        const currentDate = new Date();

        productsOnDiscount.forEach(product => {
            const toDate = new Date(product.discount.to);

            if (currentDate >= toDate) expiredDiscounts.push(product._id);
        
        });

        // Call the method only if there are products with expired discounts
        if (expiredDiscounts.length > 0) await DiscountsService.removeDiscountsFromProducts(expiredDiscounts);
        
    }).start();
}

module.exports = discountedProductsCRON;

// jobs/index.js
const discountedProductsCRON = require("./discountedProducts");

// Just so we can have main entry point from where we initialize ALL of our cron jobs
module.exports = function() {
    discountedProductsCRON();
}

// loaders/index.js
const cronJobs = require("../jobs/index");

async function() {
    
    // We add the CRON jobs after we initialized the express server and connected to our database
    await cronJobs();
    console.log("CRON Jobs initialized");
};
```