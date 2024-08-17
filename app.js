const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const xlsx = require('xlsx');

const app = express();

// set up mySql connection
    const connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'Admin@123',
        database:'testing'
    });

// connect to the MySQL database
    connection.connect(err =>{
        if(err){
            console.log('Error connectiion to MySQL', err);
            return;
        }
        console.log('Db connected');
    }) ;
    
// configure multer for file uploads
const upload = multer({dest:'upload/'});

// route to handl file upload

app.post('/upload', upload.single('file'), (req, res)=>{
    // get the uploaded file 
    const file = req.file;

    // read the uploaded Excel file
    const workbook = xlsx.readFile(file.path);

    // get the first sheet in the workbook
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];

    // Convert the seet data to JSON format
    const data = xlsx.utils.sheet_to_json(workSheet);
    console.log(data);

    const sql = "INSERT INTO testing (column1, column2, column3) VALUES ?";

    const values = data.map(row=> [row.column1, row.column2, row.column3] );

    connection.query(sql, [values], (err, result)=>{
        if(err){
            console.log('Error inserting data', err);
            return res.status(500).json({error:'Something went wrong'})
        }
        return res.status(200).json({message:'Date insert '})
    })


})

app.listen(3000, ()=>{
    console.log('Server running on port 3000');
})