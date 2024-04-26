const pgp = require('pg-promise')();

const connection = {
    host: 'localhost',
    port: 5432,
    database:'postgres',
    user:'postgres',
    password:'sai@4080'
};

const db = pgp(connection);

db.connect().then(()=>{
    console.log('Db connection successfull')
}).catch((err)=>{
    console.error('Db connection failed', err)
});

module.exports= db;

