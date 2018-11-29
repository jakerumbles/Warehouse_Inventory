CREATE TABLE inventory(
    inv_id SERIAL,
    description VARCHAR(100) NOT NULL,
    category VARCHAR(25) DEFAULT 'unknown',
    date_recieved DATE DEFAULT NOW(),
    storage_location VARCHAR(4) NOT NULL,
    total INTEGER NOT NULL,
    reserved INTEGER NOT NULL DEFAULT 0,
    available INTEGER NOT NULL,
    present BOOLEAN DEFAULT 'true',
    PRIMARY KEY(inv_id)
);

CREATE TABLE inventory_history(
    hist_id SERIAL,
    inv_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    date_modified DATE DEFAULT NOW(),
    history VARCHAR(100),
    PRIMARY KEY(hist_id),
    FOREIGN KEY(inv_id) REFERENCES inventory(inv_id)
);

CREATE TABLE project(
    proj_id SERIAL,
    manager_id uuid NOT NULL,
    PRIMARY KEY(proj_id),
    FOREIGN KEY(manager_id) REFERENCES manager_name(manager_id)
);

CREATE TABLE manager_name(
    manager_id uuid NOT NULL,
    name VARCHAR(25) NOT NULL,
    PRIMARY KEY(manager_id),
);

CREATE TABLE project_items(
    proj_id SERIAL,
    inv_id, SERIAL,
    reserved INTEGER DEFAULT 0,
    PRIMARY KEY(proj_id, inv_id),
    FOREIGN KEY(proj_id) REFERENCES project(proj_id),
    FOREIGN KEY(inv_id) REFERENCES inventory(inv_id)
);

CREATE TABLE users(
    id uuid NOT NULL,
    firstName VARCHAR(64),
    lastName VARCHAR(64),
    email VARCHAR(128),
    password VARCHAR(60),
    access INTEGER DEFAULT 10,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE
    PRIMARY KEY(item_id)
);
