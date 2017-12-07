const fs = require('fs')
const shouldCreateSchema = !fs.existsSync('./database/db.db')

const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database/db.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, () => {
    if (shouldCreateSchema) {
        const schema = fs.readFileSync('./database/schema.sql', { encoding: 'utf8' })
        db.exec(schema)
    }
})

export default {
    instance: db,
    run: (sql, param = []) => new Promise((resolve, reject) => db.all(sql, param, (err, result) => !err? resolve(Array.from(result)) : reject(err))),
    exec: sql => new Promise((resolve, reject) => db.exec(sql, err => !err ? resolve() : reject()))
}