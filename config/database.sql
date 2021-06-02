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
    last_name varchar(255),
    active int DEFAULT 0
);


----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE admin(
    id serial primary key,
    first_name varchar(255),
    last_name varchar(255),
    email varchar(255),
    password varchar(255),
    role varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE categories(
    id serial primary key,
    category varchar(255),
    description varchar(255),
    image varchar(255),
    active int DEFAULT 0
);


----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE subcategories(
    id serial primary key,
    category_id int,
    name varchar(255),
    description varchar(255),
    image varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE finishingoptions(
    id serial primary key,
    subcategory_id int,
    name varchar(255),
    active int DEFAULT 0
);


----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE products(
    id serial primary key,
    category_id int,
    subcategory_id int,
    finishingoptions_id int,
    name varchar(255),
    description varchar(255),
    image varchar(255),
    price varchar(255),
    active int DEFAULT 0
);