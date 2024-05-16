import axios from 'axios';
import SQLite from 'sqlite3';

const tableName: string = 'users';

const db = new SQLite.Database(
	'./src/fetch-api/test.db',
	SQLite.OPEN_READWRITE,
	(err: Error | null) => {
		if (err) throw err;
		else console.log('DB connected');
	},
);

async function createTable() {
	const sql = `
		CREATE TABLE IF NOT EXISTS ${tableName} (
		id INTEGER PRIMARY KEY, 
		first_name, 
		last_name, 
		username,
		email,
		birthday,
		country
	)`;

	try {
		// COMMENT: exec(), run(), all(), etc. run asyncronous but sqlite3 does not support promise or async/await syntax. So we can wrap callback based functions with Promise to a return value with state (pending, resolved, rejected)
		await new Promise<void>((resolve, reject) => {
			db.exec(sql, (err: Error | null) => {
				if (err) reject(err);
				else {
					console.log(
						`Table "${tableName}" created! Or already exists.`,
					);
					resolve();
				}
			});
		});
	} catch (err) {
		throw err;
	}
}

async function insertData(users: any[]) {
	const sql = `
		INSERT INTO ${tableName} (
		first_name,
		last_name,
		username,
		email,
		birthday,
		country
		) VALUES (?,?,?,?,?,?)
	`;

	try {
		for (const user of users) {
			await new Promise<void>((resolve, reject) => {
				db.run(
					sql,
					[
						user.first_name,
						user.last_name,
						user.username,
						user.email,
						user.date_of_birth,
						user.address.country,
					],
					(err: Error | null) => {
						if (err) reject(err);
						else {
							console.log(
								`User: ${user.first_name} ${user.last_name} added.`,
							);
							resolve();
						}
					},
				);
			});
		}
	} catch (err) {
		throw err;
	}
}

async function getApiData() {
	try {
		await createTable();

		const { data } = await axios.get(
			'https://random-data-api.com/api/users/random_user?size=10',
		);

		await insertData(data);
	} catch (err) {
		throw err;
	}
}

async function displayData() {
	const sql = `
		SELECT * FROM ${tableName}
	`;

	try {
		await getApiData();

		await new Promise<void>((resolve, reject) => {
			db.all(sql, [], (err: Error | null, rows: []) => {
				if (err) reject(err);
				if (rows) {
					console.log('ALL :>> ', rows);
					resolve();
				}
			});
		});

		db.close();
	} catch (err) {
		throw err;
	}
}

displayData();
