const express = require('express');
const app = express();

const port = 8000;
const db = require('./dbConnection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello...!')
});

app.get('/emp', (req, res) => {
    db.query('select * from employee').then((data) => {
        res.send(data);
    }).catch((err) => {
        console.log(err);
    });
});
app.get('/empuni', (req, res) => {
    db.query('select * from employeeuni').then((data) => {
        res.send(data);
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/nameUni', (req, res) => {
    db.query(`with abc_cte as (
        select E.id, name, degree, university 
        from employee E
        full join employeeUni E2
        on E.id=E2.id )
        select * into insert_table from abc_cte`)
        .then(() => {
            res.send('Inserted Successfully..!');
        })
        .catch((err) => {
            console.error('Error:', err);
            res.status(500).send('Internal Server Error');
        });
});


app.get('/insertIntoNewTable', (req, res)=>{
    db.query(`WITH abc_cte AS (
        SELECT E.id, name, degree, university 
        FROM employee E
        FULL JOIN employeeUni E2 ON E.id = E2.id
    )
    INSERT INTO new_table (id, name, degree, university)
    SELECT id, name, degree, university
    FROM abc_cte
    ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        degree = EXCLUDED.degree,
        university = EXCLUDED.university;`).then(()=>{
            res.send('Inserted Successfully..!');
        }).catch((err)=>{
            console.log(err);
            res.status(500).send('Internal Server Error');
        })
})

app.get('/updatedTable', (req, res)=>{
    db.query(`select * from new_table order by id`).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        console.log(err);
        res.status(500).send('Internal Server Error');
    })
})
app.listen(port, () => {
    console.log(`Listening to the port ${port}`)
});