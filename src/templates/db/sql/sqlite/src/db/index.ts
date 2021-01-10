import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

// Initialize SQLite database
const db = new sqlite.Database(":memory:");

export default db;
