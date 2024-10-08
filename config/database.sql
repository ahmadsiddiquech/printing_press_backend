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

ALTER TABLE users
ADD COLUMN telephone varchar(255);

ALTER TABLE users
ADD COLUMN mobile varchar(255);

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


CREATE TABLE products(
    id serial primary key,
    category_id int,
    subcategory_id int,
    name varchar(255),
    description varchar(255),
    image varchar(255),
    -- price varchar(255),
    active int DEFAULT 0,
    featured int DEFAULT 0
);
ALTER TABLE products
ADD COLUMN featured boolean DEFAULT false;

 ALTER TABLE products DROP featured;

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
    p_id varchar(255),
    product_id varchar(255),
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

ALTER TABLE product_options
ALTER COLUMN p_id TYPE varchar(255);

---------------------------------------------------------
---------------------------------------------------------

CREATE TABLE user_addresses(
    id serial primary key,
    user_id varchar(255),
    contact_name varchar(255),
    company_name varchar(255),
    phone varchar(255),
    address varchar(255),
    state varchar(255),
    postcode varchar(255),
    country varchar(255),
    billing_address varchar(255),
    delivery_address varchar(255)
);

---------------------------------------------------------
---------------------------------------------------------

CREATE TABLE orders(
    id serial primary key,
    user_id varchar(255),
    billing_address integer,
    delivery_address integer,
    delivery varchar(255),
    items_price varchar(255),
    delivery_fee varchar(255),
    total_price varchar(255),
    order_status varchar(255),
    order_date varchar(255),
);

ALTER TABLE orders
DROP billing_address;

ALTER TABLE orders
ALTER COLUMN user_id int(11);

ALTER TABLE orders
ADD COLUMN billing_address integer;

ALTER TABLE orders
ADD COLUMN delivery varchar(255);

---------------------------------------------------------
---------------------------------------------------------

CREATE TABLE order_products(
    id serial primary key,
    order_id integer,
    product_id varchar(255),
    turnaround varchar(255),
    product_design varchar(255)
);

ALTER TABLE order_products
DROP order_id;

ALTER TABLE order_products
ADD COLUMN order_id integer;

