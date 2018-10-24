CREATE TABLE inventory(
    inv_id SERIAL,
    description VARCHAR(100) NOT NULL,
    category VARCHAR(25) DEFAULT 'unknown',
    date_recieved DATE DEFAULT NOW(),
    storage_location VARCHAR(4) NOT NULL,
    present VARCHAR(5) NOT NULL,
    reserved VARCHAR(5) DEFAULT 'false',
    PRIMARY KEY(inv_id)
);
CREATE TABLE "users"(
    id uuid NOT NULL,
    firstName VARCHAR(64),
    lastName VARCHAR(64),
    email VARCHAR(128),
    password VARCHAR(60),
    access INTEGER,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE
    PRIMARY KEY(item_id)
);
CREATE TABLE inventory_history(
    hist_id SERIAL,
    inv_id INTEGER NOT NULL,
    description VARCHAR(100) NOT NULL,
    category VARCHAR(25) NOT NULL,
    date_recieved DATE DEFAULT NOW(),
    storage_location VARCHAR(4) NOT NULL,
    history VARCHAR(100),
    PRIMARY KEY(hist_id)
);
