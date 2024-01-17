require('dotenv').config();
const mysql = require('mysql2');
const { prompt } = require("inquirer");
let categoryChoice;

const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'employees_db'
    },
    console.log(`Successfully connected to the employees_db database.`)
);

async function loadFirstQuestion(){
    const tableData = await myQuery('SHOW TABLES')
    tableNames = tableData.map((table)=>table.Tables_in_employees_db)
    // .map((table)=>table.Tables_in_employees_db.charAt(0).toUpperCase()+table.Tables_in_employees_db.slice(1));
    prompt([{
        type: "list",
        message: "Choose a category.",
        name: "starterCategory",
        choices: tableNames
    }])
    .then((result)=>{
        categoryChoice = result.starterCategory;
        // questionTwo(result)
        let actionChoices = ["View", "Add", "Delete"];
        if (result === "Employees"){
            actionChoices.splice("Update", 0, 3);
        };
    
       prompt([{
            type: "list",
            message: "Choose an action.",
            name: "catAction",
            choices: actionChoices
        }])
        .then((result)=>{
            switch(result.catAction){
                case 'View':
                    console.log(categoryChoice)
                    viewSimple(categoryChoice);
                    break;
                case 'Add':
                    console.log('tbd');
                    break;
                case 'Delete':
                    console.log('tbd');
                    break;
                case 'Update':
                    console.log('tbd');
            }
        })
    })
    
}


// Unique Questions

async function questionTwo(category){
    console.log('bub')
    let actionChoices = ["View", "Add", "Delete"];
    if (category === "Employees"){
        actionChoices.splice("Update", 0, 3);
    };

   prompt([{
        type: "list",
        message: "Choose an action.",
        name: "catAction",
        choices: actionChoices
    }])

};


// repeat questions
async function viewSimple(){
    // const tableName = table.toLowerCase();
    const viewEntries = await myQuery(`SELECT * FROM ${categoryChoice}`);
    // print(...viewEntries)
    console.log(viewEntries)
    // return;
    // conclusion(categoryChoice)
    db.end()
};

// Special Questions
async function conclusion(category){
    const questionEnd = await prompt([{
        type: "list",
        message: "You have reached the end of your action.",
        name: "conclusion",
        choices: ["Continue", "Restart", "Quit"]
    }])
    switch(questionEnd.conclusion){
        case "Continue":
            const cont = await questionTwo(category);
        case "Restart":
            const restart = await loadFirstQuestion();
        case "End":
            const end = await db.end();
    };
};

// Utils

async function myQuery(query){
    return new Promise((resolve, reject)=>{
        db.query(query, (err, result)=>{
            if (err){
                reject(err);
            } else{
                resolve(result);
            };
        })
    })
};

async function init(){
    // const testa = 'departments'
    // const test = await myQuery(`SELECT * FROM ${testa}`)
    // console.log(test)
    await loadFirstQuestion();
};

init()