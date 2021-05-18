CREATE DATABASE printing_press;
----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE users(
    id serial primary key,
    first_name varchar(255),
    last_name varchar(255),
    email varchar(255),
    password varchar(255),
    role varchar(255),
    active int
);

ALTER TABLE users ALTER COLUMN active SET DEFAULT 0;
ALTER TABLE users ADD COLUMN image varchar;


----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE admin(
    id serial primary key,
    first_name varchar(255),
    last_name varchar(255),
    email varchar(255),
    password varchar(255),
    role varchar(255),
    active int
);

ALTER TABLE admin ALTER COLUMN active SET DEFAULT 0;

----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE categories(
    id serial primary key,
    category varchar(255),
    description varchar(255),
    image varchar(255),
    active int DEFAULT 0
);

ALTER TABLE categories ALTER COLUMN active SET DEFAULT 0;