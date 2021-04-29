CREATE DATABASE printing_press;

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