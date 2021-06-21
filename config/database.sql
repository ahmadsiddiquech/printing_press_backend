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
    price varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE additionaloptions(
    id serial primary key,
    subcategory_id int,
    name varchar(255),
    price varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------

CREATE TABLE unfoldedsize(
    id serial primary key,
    subcategory_id int,
    name varchar(255),
    price varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------

CREATE TABLE printedsides(
    id serial primary key,
    subcategory_id int,
    name varchar(255),
    price varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------

CREATE TABLE papertype(
    id serial primary key,
    subcategory_id int,
    name varchar(255),
    price varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------

CREATE TABLE paperweight(
    id serial primary key,
    subcategory_id int,
    name varchar(255),
    price varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------

CREATE TABLE foldingstyle(
    id serial primary key,
    subcategory_id int,
    name varchar(255),
    price varchar(255),
    active int DEFAULT 0
);

----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE products(
    id serial primary key,
    category_id int,
    subcategory_id int,
    name varchar(255),
    description varchar(255),
    image varchar(255),
    -- price varchar(255),
    active int DEFAULT 0
);

 ALTER TABLE products DROP price;

----------------------------------------------------------
----------------------------------------------------------
CREATE TABLE product_finishingoption(
    id serial primary key,
    product_id int,
    finishingoptions_id int
);

---------------------------------------------------------
---------------------------------------------------------

CREATE TABLE product_options(
    id serial primary key,
    p_id int,
    product_id int,
    product_type varchar(255),
    quantity varchar(255),
    finishing_size varchar(255),
    printed_pages varchar(255),
    stock varchar(255),
    cover varchar(255),
    lamination varchar(255),
    one_day varchar(255),
    two_day varchar(255),
    three_day varchar(255),
    seven_day varchar(255),
    vat varchar(255)
);