const db = require('../../database').default

export default {
    fetch: email => {
        const Q = `
            SELECT * FROM USER WHERE USER.email = "${email}";
        `
        return db.run(Q)
    },
    create: user => {
        const Q = `
            INSERT INTO USER (name_t, email, pic) VALUES ("${user.name_t}","${user.email}","${user.pic}");
        `
        return db.run(Q)
    }
}