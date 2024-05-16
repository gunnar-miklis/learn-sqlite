# SQLite

> _Learn SQLite basics_

-   nodeJS commands
-   SQL queries, `./CRUD/app.js`
-   API into DB, `./fetch-api/app.ts`

## nodeJS commands

### connect DB

```javascript
const db = new SQLite.Database('./test.db', SQLite.OPEN_READWRITE);
```

(optional) modes:

-   OPEN_READONLY
-   OPEN_READWRITE
-   OPEN_CREATE
-   default: OPEN_READWRITE | OPEN_CREATE

### close DB

```javascript
db.close();
```

### operations

-   `.all()`
-   `.run()`
-   `.exec()`
-   `.get()`
-   `.each()`

### callback

```javascript
db.run(sql, [data], (error, rows) => {
	if (error) throw error.message;
	if (rows) {
		rows.forEach((row) => console.log(row));
	} else console.log('some message');
});
```

### asyncronous

-   exec(), run(), all(), etc. run asyncronous.
-   but sqlite3 does not support promise or async/await syntax.
-   so instead we can wrap callback-based functions with a Promise to return a value with state (pending, resolved, rejected).

```javascript
const rows = await new Promise((resolve, reject) => {
	db.all(sql, [], (err, rows) => {
		if (err) reject(err);
		if (rows) resolve(rows);
	});
});
```

## SQL Queries

### new table

```sql
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY,
	first_name NOT NULL,
	last_name,
	username UNIQUE
)
```

```javascript
db.exec(sql, callback);
```

### drop table

```sql
DROP TABLE users
```

```javascript
db.run(sql);
```

## CRUD

### getAll

```sql
SELECT * FROM users
```

```javascript
db.all(sql, [], callback);
```

### getOne

```sql
SELECT * FROM users
WHERE first_name = ?
```

```javascript
db.get(sql, [user.firstName], callback);
```

### getEach

```sql
SELECT * FROM users
WHERE first_name = ?
```

```javascript
db.get(sql, [user.firstName], callback);
```

### insertOne

```sql
INSERT INTO users (
	first_name,
	last_name,
	username
) VALUES (?,?,?)
```

```javascript
db.run(sql, [user.firstName, user.lastName, user.username], callback);
```

### updateOne

```sql
UPDATE users
SET last_name = ?
WHERE username = ?
```

```javascript
db.run(sql, [user.last_name, user.username], callback);
```

### deleteOne

```sql
DELETE FROM users
WHERE username = ?
```

```javascript
db.run(sql, [user.username], callback);
```

## API into DB

| step | description                          | command/query                |
| ---- | ------------------------------------ | ---------------------------- |
| 1.   | connect to database                  | `new SQLite.Database()`      |
| 2.   | create a table                       | `CREATE TABLE IF NOT EXISTS` |
| 3.   | fetch api data                       | `axios.get()`                |
| 4.   | then populate database with api data | `INSERT INTO`                |
| 5.   | finally read from database           | `SELECT * FROM table`        |
| 6.   | close database                       | `db.close()`                 |
