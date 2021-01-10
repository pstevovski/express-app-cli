## Utils

You create all of your utility functions here, in one organized folder.

***If your project does not use any utility functions, which is doubtful, you can delete this folder***.

> **NOTE**: The example is in vanilla JavaScript. If you're using TypeScript, you probably already know what to do :)

An example of a utility function for calculating discounts:
```js
const calculateDiscount = (price, discount) => price - ( price * discount / 100);

module.exports = calculateDiscount;
```