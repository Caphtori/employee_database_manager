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
                    addEntry();
                    break;
                case 'Delete':
                    deleteSimple()
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
    switch(categoryChoice){
        case 'departmenst':
            const viewEntries = await myQuery(`SELECT * FROM ${categoryChoice}`);
            break;
        case 'roles':
            await myQuery ( "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;");
        case 'employees':
            await myQuery("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")
    }
    
    const viewEntries = await myQuery(`SELECT * FROM ${categoryChoice}`);
    console.log(viewEntries);
    db.end()
};

async function deleteSimple(){
    const getEntries = await myQuery(`SELECT * FROM ${categoryChoice}`);
    prompt({
        type: "list",
        message: "Which would you like to delete?",
        name: "deleteChoice",
        choices: getEntries
    })
    .then(async(result)=>{
        await myQuery(`DELETE FROM ${categoryChoice} WHERE id=${result.deleteChoice.id}`)
    })
    .then(db.end())
}

async function addEntry(){
    switch(categoryChoice){
        case 'role':
            const departmentsData = await myQuery(`SELECT * FROM ${categoryChoice}`);
            const departments = departmentsData
            .map(({ id, name })=>{
                id,
                name
            })
            prompt([{
                
            }])
    }
    // const answers = []
    // const singular = categoryChoice.slice(0, -1);
    // const columnsData = await myQuery(`SHOW COLUMNS FROM ${categoryChoice}`);
    // const columnNames = columnsData.map((column)=>column.Field).filter((entry)=>entry==='id'? false:true).join(', ')
    // const columns = columnsData.map((column)=>column.Field).filter((entry)=>entry==='id'? false:true)
    // .map((q)=>{
    //     return {
    //         type: 'input',
    //         message: `Enter ${q}.`,
    //         name: 'columnAnswers'
    //     }
    // })
    // for (let i =0; i<columns.length; i++){
    //     const result = await prompt(columns[i])
    //     answers.push(result)
    // }
    // const formatAnswers = answers.map((answer)=>answer.columnAnswers).join(', ');
    // console.log(formatAnswers)
    // await myQuery(`INSERT INTO ${categoryChoice}(${columnNames}) VALUES ?`, formatAnswers);
    // columns.forEach(async (column)=>{
    //     prompt([{
    //         columns
    //     }])
    //     .then((result)=>{
    //         console.log(result)
    //         answers.push(result.columnAnswers);
    //     })
    //     console.log(answers)
    //     // await myQuery(`INSERT INTO ${categoryChoice} SET ${answers}`);
    // })
    // prompt(columns)
    // .then((results)=>{
    //     console.log(results)
    // })
    // console.log(columns)
    // prompt(columns).then((results)=>{console.log(results)})

}

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
    // const test = await myQuery("SHOW COLUMNS FROM roles")
    // console.log(test)
    await loadFirstQuestion();
};

init()