CREATE TABLE TASK(
    _id             INTEGER PRIMARY KEY,
    description_t   TEXT,
    details         TEXT,
    priority        INTEGER,
    id_creator      INTEGER,
    id_completer    INTEGER,
    id_queue        INTEGER,
    status_c        INTEGER
);

CREATE TABLE USER(
    _id             INTEGER PRIMARY KEY,
    name_t          TEXT,
    email           TEXT,
    pic             TEXT
);

CREATE TABLE UPLOAD(
    id_task         INTEGER,
    filename_t      TEXT,
    timestamp_t     TEXT,
    link            TEXT
);

CREATE TABLE TASKQUEUE(
    _id             INTEGER PRIMARY KEY,
    name_t          TEXT,
    id_creator      INTEGER
);

CREATE TABLE TASKQUEUE_USER(
    id_user         INTEGER,
    id_taskqueue    INTEGER
);

INSERT INTO TASKQUEUE (name_t, id_creator) VALUES ("Fila Principal", NULL);