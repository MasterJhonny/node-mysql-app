// import el modulo para hacer la connection con nysql
const mysql = require('mysql');

//  inport delmodulo para tilizar promesas
const { promisify } = require('util');

// import las keys de connection 
const { database } = require('./keys');

// creamos la connection
const pool = mysql.createPool(database);

// manejamos los errores y la connection
pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) {
        connection.release();
        console.log('Database is Connection, yes!');
        return;
    }
});

// promisify pool query
pool.query = promisify(pool.query);

// export the connection
module.exports = pool;