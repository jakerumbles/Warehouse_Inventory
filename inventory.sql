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
CREATE TABLE item(
  item_id SERIAL,
  description VARCHAR(100) NOT NULL,
  category VARCHAR(25) DEFAULT 'unknown',
  date_recieved TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(item_id)
);
CREATE TABLE user_account(
  user_id SERIAL,
  user_name VARCHAR(100) NOT NULL,
  user_mobile VARCHAR(100) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  user_address VARCHAR(100) NOT NULL,
  date_started TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(user_id)
);
CREATE TABLE project(
  project_id SERIAL,
  description VARCHAR(100) NOT NULL,
  project_items INT NOT NULL REFERENCES item(item_id),
  manager INT NOT NULL REFERENCES user_account(user_id),
  date_started TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(project_id)
);
ALTER TABLE user_account ADD COLUMN manages_project INT REFERENCES project(project_id);
