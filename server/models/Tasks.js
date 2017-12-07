const db = require('../../database').default

export default {
    fetch: (id, queue) => {
        let Q
        if (!id) {
            Q = `
                SELECT TASK._id,
                    TASK.description_t,
                    TASK.status_c,
                    TASK.id_creator AS author_id,
                    TASK.priority,
                    TASK.id_queue,
                    CREATOR.name_t AS author_name,
                    TASK.id_completer AS completer_id,
                    COMPLETER.name_t AS completer_name,
                    (SELECT '[' ||
                        GROUP_CONCAT((
                            SELECT '{' ||
                                "filename_t"  || ':' || '"' || UPLOAD.filename_t  || '",' ||
                                "timestamp_t" || ':' || '"' || UPLOAD.timestamp_t || '",' ||
                                "link"        || ':' || '"' || UPLOAD.link        || '",'
                            || '}'
                            FROM UPLOAD
                        ), ',')
                    || ']') as files
                FROM TASK
                INNER JOIN USER AS CREATOR
                    ON TASK.id_creator = CREATOR._id
                LEFT JOIN USER AS COMPLETER
                    ON TASK.id_completer = COMPLETER._id
                ${queue ? "WHERE TASK.id_queue = " + queue : ""};`
        }
        else {
            Q = `
                SELECT TASK._id,
                    TASK.description_t
                    TASK.details,
                    (
                        SELECT '{' +
                            '"id":"'     + CREATOR._id     + '"' +
                            '"name_t":"' + CREATOR.name_t + '"' +
                        '}'
                        FROM USER AS CREATOR
                        WHERE USER._id = TASK._id
                    ) AS creator,
                    (
                        SELECT '{' +
                            '"id":"'     + COMPLETER._id     + '"' +
                            '"name_t":"' + COMPLETER.name_t + '"' +
                        '}'
                        FROM USER AS COMPLETER
                        WHERE USER._id = TASK._id
                    ) AS completer
                FROM TASK
            `
        }
        return db.run(Q)
    },
    insert: (task) => {
        const Q = `
            INSERT INTO TASK (
                description_t, details, priority, id_creator, id_queue, status_c
            ) VALUES (
                "${task.description_t}","${task.details || ""}",${task.priority},${task.id_creator},${task.id_queue},0
            );
        `
        console.log(Q)
        return db.run(Q).then((err) => {
            const Q = `SELECT MAX(_id) AS C FROM TASK;`
            return db.run(Q)
        }).then(([{ C }]) => C)
    },
    update: (task) => {
        const Q = `
            UPDATE TASK SET description_t = "${task.description_t}",
                details = "${task.details || ""}",
                priority = ${task.priority}
            WHERE TASK._id = ${task._id};
        `
        return db.run(Q).then((err) => console.log(err) || 200).catch(e => 500)
    },
    delete: (id) => {
        const Q = `
            DELEte FROM TASK WHERE TASK._id = ${id};
        `
        return db.run(Q).then(() => 200).catch(e => 500)
    },
    done: (id, id_completer) => {
        const Q = `
            UPDATE TASK SET status_c = 2, id_completer = ${id_completer} WHERE TASK._id = ${id};
        `
        db.run(Q).then(() => 200).catch(e => 500)
    },
    undone: id => {
        const Q = `
            UPDATE TASK SET status_c = 0, id_completer = NULL WHERE TASK._id = ${id};
        `
        db.run(Q).then(() => 200).catch(e => 500)
    }
}