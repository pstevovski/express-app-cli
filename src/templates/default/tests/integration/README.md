## Integration Tests

Integration tests are automated tests, that are written to ensure that the class, or component, **with** their external dependencies, works and behaves as intended. It tests the **integration** of our code with dependencies such as databases, HTTP requests to endpoints, uploading / deleting files etc. These tests take a bit longer to execute compared to unit tests, but on the other hand, provide bigger confidence in the reliability of our application.

A basic example of a integration test, using Jest, where we'll test the response of a route that accepts a GET request:

> NOTE: The example uses vanilla JavaScript - it doesn't differs much if TypeScript was used instead.

```js
// tests/integration/route_example.test.js
const request = require("supertest");

describe("Basic integration test", () => {
    // We need to start up our server first, before each test
    let server;
    beforeEach(() => {
        server = require("../../src/app.js");
    });
    
    // We close the server after each test has completed
    afterEach(async() => {
        await server.close();
    });

    // A token that will be used with the authorization
    let token;

    // This function will be called on multiple places inside this test block, so we might define it here
    const executeRequest = () => request(server).get("/api/example-route").set("Authorization", `Bearer ${token}`);

    it("should return 401 - unauthorized - error if user is not logged in", async() => {
        // If invalid token is provided then user is not authenticated
        token = "abc";

        const response = await executeRequest();

        expect(response.status).toBe(401);
        expect(response.body.error).toMatch("Unauthorized access");
    });

    it("should return 200 - OK - if user logs in successfully", async() => {
        token = "working_token_example";
        const response = await executeRequest();

        expect(response.status).toBe(200);
        expect(response.body.message).toMatch("Data fetched.");
    })
});
```