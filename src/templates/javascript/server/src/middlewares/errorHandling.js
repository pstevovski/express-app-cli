module.exports = (err, req, res, next) => {
    // By default it logs to the console. If a logger is selected as extra dependency, change this line
    console.log("ERROR: ", err);

    // Send 500 error as a response
    res.status(500).json({ status: 500, error: "Something went wrong!" });
}