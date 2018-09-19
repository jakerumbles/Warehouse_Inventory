CREATE TABLE inventory(
  inv_id SERIAL,
  description VARCHAR(100) NOT NULL,
  category VARCHAR(25) DEFAULT 'unknown',
  date_recieved TIMESTAMP DEFAULT NOW(),
  storage_location VARCHAR(4) NOT NULL,
  present VARCHAR(5) NOT NULL,
  reserved VARCHAR(5) DEFAULT 'false',
  PRIMARY KEY(item_id)
);