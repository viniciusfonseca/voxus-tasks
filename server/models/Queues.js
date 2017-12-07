const db = require('../../database').default

export default {
    fetch: (id) => {
        let Q
        if (!id) {
            Q = `
                SELECT TASKQUEUE._id,
                    TASKQUEUE.name_t,
                    TASKQUEUE.id_creator
                FROM TASKQUEUE;
            `
        }
        else {
            Q = `
                SELECT TASKQUEUE._id,
                    TASKQUEUE.name_t,
                    (
                        SELECT '{' +
                            '"id":"'     + CREATOR._id    + '"' +
                            '"name_t":"' + CREATOR.name_t + '"' +
                        '}'
                        FROM USER AS CREATOR
                        WHERE USER._id = TASKQUEUE.id_creator
                    ) AS creator
                FROM TASKQUEUE
                WHERE TASKQUEUE._id = ${id};
            `
        }
        return db.run(Q)
    },
    insert: (queue) => {
        const Q = `
            INSERT INTO TASKQUEUE (name_t, id_creator) VALUES("${queue.name_t}", ${queue.id_user});
        `
        return db.run(Q).then(() => {
            const Q = `SELECT MAX(_id) AS C FROM TASKQUEUE;`
            return db.run(Q)
        }).then(([{ C }]) => C).catch(e => 500)
    },
    update: (queue) => {
        // console.log('update queue',queue)
        const Q = `
            UPDATE TASKQUEUE SET name_t = "${queue.name_t}"
            WHERE TASKQUEUE._id = ${queue._id};
        `
        return db.run(Q).then(() => 200).catch(e => console.log(e) || 500)
    },
    delete: (id) => {
        const Q = `
            DELETE FROM TASKQUEUE WHERE TASKQUEUE._id = ${id};
        `
        return db.run(Q).then(() => 200).catch(e => 500)
    }
}