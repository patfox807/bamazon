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
    managerMenu();
});


function managerMenu() {
    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit the program"]
    }).then(function (res) {
        switch (res.choices) {
            case "View Products for Sale":
                viewSales();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Exit the program":
                connection.end();
        }
    });
}

function viewSales() {
    console.log("My Bamazon Products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        res.forEach(item => {
            console.log(`ID: ${item.id} | Product: ${item.product_name} | Department: ${item.department_name}| Price: ${item.price} | Number in Stock: ${item.stock_quantity} `);
            console.log(`---------------------------------------\n`);
        });
        managerMenu();
    });
}

function viewLowInventory() {
    connection.query("SELECT * FROM products having stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name, res[i].stock_quantity);

        }
        managerMenu();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            // console.log(res)
            console.log(`ID: ${res[i].id} | Product: ${res[i].product_name} | Department: ${res[i].department_name} | Price: ${res[i].price} | Stock: ${res[i].stock_quantity}`);
            console.log('')
        };
        inquirer.prompt([{
            name: "restock",
            message: "What item would you like to restock?"

        }, {
            name: "itemRestocked",
            message: "How much would you like to restock?"

        }]).then(function (answer) {
            newAmount = parseInt(res[answer.restock - 1].stock_quantity) + parseInt(answer.itemRestocked);
            id = res[answer.restock - 1].id;;
            console.log(`New product stock amount is ${newAmount}`);
            getInventory(newAmount, id);
        });
    }
    )
}

function getInventory(newAmount, id) {
    var query = connection.query(
        "Update products SET ? WHERE ?",
        [{
            stock: newAmount
        },
        {
            id: id
        }
        ],
    );
    console.log(query.sql);
    managerMenu();
}

function newProduct() {
    inquirer.prompt([{
        name: "productName",
        message: "What is the product you would like to add?"
    },{
        name: "departmentName",
        message: "What department do you want to add the new product to?"
    },{
        name: "newItemPrice",
        message: "How much does the new product cost?"
    },{
        name: "stockQuantity",
        message: "How much stock will you like to add?"
    }]).then(function (answer){
        console.log(answer);
        updateDB(answer);
    })
}

function updateDB(res) {
    console.log("Adding new product");

    var query = connection.query(
        "insert into products set ?", {
            product_name: res.productName,
            department_name: res.departmentName,
            price: res.newItemPrice,
            stock_quantity: res.stockQuantity,
        },
        function(err) {
            if (err) throw err;
        }
    );
    console.log(query.sql);
    console.log("Successfully Added");
    managerMenu();
}
