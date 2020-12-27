const sqlite3 = require("sqlite3").verbose();

// Initialize SQLite database
const db = new sqlite3.Database(":memory:");

export default db;