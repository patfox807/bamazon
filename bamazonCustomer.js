var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    bamazon();
});

function bamazon() {
    readProducts();

}


function readProducts() {
    console.log("My Bamazon Products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(item => {
            console.log(`ID: ${item.id} | Product: ${item.product_name} | Department: ${item.department_name}| Price: ${item.price} | Number in Stock: ${item.stock_quantity} `);
            console.log(`---------------------------------------\n`);
        });
        buyStuff();
    });
}

function buyStuff() {
    inquirer.prompt([{
        message: "Choose product by ID number",
        name: "userIDChoice"
    }]).then((response) => {
        displayIDChoice(response.userIDChoice);
    });
}

function displayIDChoice(choice) {
    connection.query("SELECT * FROM products WHERE ?", [{
        id: choice
    }], function (err, res) {
        console.log(res);
        if (err) throw err;

        console.log(`ID: ${res[0].id} | Product: ${res[0].product_name} | Department: ${res[0].department_name}| Price: ${res[0].price} | Number in Stock: ${res[0].stock_quantity} `)
   
            purchaseAmount(res[0]);
    });
}

function purchaseAmount(stock) {
    inquirer.prompt([{
        message: "How much would you like to buy?",
        name: "purchaseAmount"
    }]).then((response) => {
        if(response.purchaseAmount > stock.stock_quantity){  
            console.log("We don't have that amount! We only have "+ stock.stock_quantity);
            purchaseAmount(stock);
        } else {
            var stockLeft =stock.stock_quantity- response.purchaseAmount;
            var totalPrice = response.purchaseAmount * stock.price;
            console.log("Your total price is "+ totalPrice);
            updateProduct(stockLeft, stock.id);
        }
    });
}

function updateProduct(stockLeft, stockID) {
    console.log("Updating quantities...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: stockLeft
        },
        {
          id: stockID
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
      }
    );
      console.log(query.sql);
}
module.exports
