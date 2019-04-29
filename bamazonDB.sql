DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER DEFAULT 0,
PRIMARY KEY (id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
value('Dog Bone', 'Pets', 2.00, 15),
('Dog Leash', 'Pets', 15.00, 20),
('Days Gone', 'Video Game', 59.99, 30),
('Chair', 'Furniture', 99.99, 10),
('Bread', 'Grocery', 3.29, 50),
('IPhone', 'Electronic', 999.99, 30),
('Book', 'School Supplies', 4.49, 100),
('Shoes', 'FootWear', 49.99, 37),
('PS4', 'Video Game', 399.99, 8),
('Charger', 'Electronic', 29.99, 150);

SELECT * FROM products;