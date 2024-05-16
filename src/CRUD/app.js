import SQLite from 'sqlite3';
SQLite.verbose();

function sqlCallback(err, result) {
	if (err) throw err;
	if (result) return console.log('result :>> ', result);
}

// NOTE: connect db
const db = new SQLite.Database(
	'./src/CRUD/test.db',
	SQLite.OPEN_READWRITE,
	sqlCallback,
);

// NOTE: close db
// db.close(sqlCallback);

// NOTE: create tables
function createTable() {
	const sql = `
		CREATE TABLE users (
		id INTEGER PRIMARY KEY, 
		first_name NOT NULL, 
		last_name, 
		username UNIQUE
	)`;
	db.run(sql);
}
// NOTE: drop tables
function dropTable() {
	const sql = `
		DROP TABLE users
	`;
	db.run(sql);
}

// NOTE: CRUDs
function getAll() {
	const sql = `
		SELECT * FROM users
	`;
	db.all(sql, [], sqlCallback);
}
function getOne(data) {
	const sql = `
		SELECT * FROM users
		WHERE first_name = ?
	`;
	db.get(sql, [data], sqlCallback);
}
function getEach(data) {
	const sql = `
		SELECT * FROM users
		WHERE first_name = ?
	`;
	db.each(sql, [data], sqlCallback);
}
function insertOne(data) {
	const sql = `
		INSERT INTO users (
		first_name, 
		last_name, 
		username
	) VALUES (?,?,?)`;
	db.run(sql, data, sqlCallback);
}
function updateOne(data) {
	const sql = `
		UPDATE users 
		SET last_name = ? 
		WHERE username = ?
	`;
	db.run(sql, data, sqlCallback);
}
function deleteOne(data) {
	const sql = `
		DELETE FROM users
		WHERE username = ?
	`;
	db.run(sql, data, sqlCallback);
}

const ana = { firstName: 'Ana', lastName: 'Smith', username: 'ana-smith' };
const ana2 = { firstName: 'Ana', lastName: 'Lopez', username: 'ana-lopez' };
const john = { firstName: 'John', lastName: 'Doe', username: 'john-doe' };

// COMMENT: care async!
// NOTE: 1. create table
dropTable();
createTable();

// NOTE: 2. insert data
insertOne([ana.firstName, ana.lastName, ana.username]);
insertOne([ana2.firstName, ana2.lastName, ana2.username]);
insertOne([john.firstName, john.lastName, john.username]);

// NOTE: 3. get data
getOne(ana.firstName);
getEach(ana.firstName);
getAll();

// NOTE: 4. update/delete data
updateOne([john.lastName, ana.username]);
deleteOne([john.username]);
