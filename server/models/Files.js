const db = require('../../database').default

export default {
    insert: (id_task, filename_t, timestamp_t, link) => {
        const Q = `
            INSERT INTO UPLOAD VALUES (${id_task}, "${filename_t}", "${timestamp_t}", "${link}");
        `
        console.log(Q)
        return db.run(Q).then(() => 200).catch(() => 500)
    },
    delete: (id_task, timestamp_t) => {
        const Q = `
            DELETE FROM UPLOAD WHERE UPLOAD.id_task = ${id_task} AND UPLOAD.timestamp_t = "${timestamp_t}";
        `
        return db.run(Q).then(() => 200).catch(() => 500)
    }
}