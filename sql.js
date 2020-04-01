const sql = require("sqlite3");
const db = new sql.Database("bot.sqlite");
console.log("Initialized database connection.")

const tables = {
	judged: [
    "id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL",
		"snowflake TEXT NOT NULL",
		"guild TEXT NOT NULL"
	],
}

for(let table in tables) {
	db.run(`CREATE TABLE ${table} (${tables[table].join(", ")})`, () => {
		console.log(`Initialized table "${table}".`);
	});
}

module.exports = db
