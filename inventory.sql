CREATE TABLE inventory(
    inv_id SERIAL,
    description VARCHAR(100) NOT NULL,
    category VARCHAR(25) DEFAULT 'unknown',
    date_recieved DATE DEFAULT NOW(),
    storage_location VARCHAR(4) NOT NULL,
    quantity INTEGER DEFAULT 0,
    remove BOOLEAN DEFAULT 'false',
    available INTEGER DEFAULT 0,
    PRIMARY KEY(inv_id)
);
CREATE TABLE "users"(
    id uuid NOT NULL,
    firstname VARCHAR(64),
    lastname VARCHAR(64),
    email VARCHAR(128),
    password VARCHAR(60),
    access INTEGER DEFAULT 4    ,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY(id)
);
CREATE TABLE inventory_history(
    hist_id SERIAL,
    inv_id INTEGER NOT NULL,
    description VARCHAR(100) NOT NULL,
    category VARCHAR(25) NOT NULL,
    quantity INTEGER NOT NULL,
    date_modified DATE DEFAULT NOW(),
    storage_location VARCHAR(4) NOT NULL,
    history VARCHAR(100),
    PRIMARY KEY(hist_id),
    FOREIGN KEY(inv_id) REFERENCES inventory(inv_id)
);
CREATE TABLE project(
    proj_id SERIAL,
    manager_id uuid NOT NULL,
    name VARCHAR(25) NOT NULL,
    PRIMARY KEY(proj_id)
);
CREATE TABLE project_items(
    proj_id INTEGER NOT NULL,
    inv_id INTEGER NOT NULL,
    reserved INTEGER DEFAULT 0,
    PRIMARY KEY(proj_id,inv_id)
);
CREATE VIEW admin AS
SELECT project.proj_id, users.id, project.name, users.email
FROM project
INNER JOIN users ON users.id = project.manager_id
ORDER BY proj_id ASC;
