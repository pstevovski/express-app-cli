## Unit Tests

Here you can write your unit tests, using the testing library that you have previously selected.

The **unit tests** are automated tests that are written to ensure that a section of an application (known as the **unit**) meets its design and behaves as intended, without calling it's external dependenceis such as database, HTTP requests, etc. The unit tests are **cheap** to write and **fast** to execute. However, because we test the unit without it's external dependencies we can't get a lot of confidence in the reliability of our application, based **solely** on unit tests.

A basic example of a unit test, using Jest:

> NOTE: The example uses vanilla JavaScript - it doesn't differs much if TypeScript was used instead.

```js
// utils/sum_example.js
function sum_example(a, b) {
    return a + b;
}

module.exports = sum_example;

// tests/unit/sum_example.test.js
const sum_example = require("../../src/utils/some_example");

describe("Some basic test", () => {
    it("should return the sum of numbers", () => {
        const result = sum_example(5, 10);

        expect(result).toBe(10);
    });
});
```