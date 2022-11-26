const express = require('express');
const bodyParser = require('body-parser');
const mysql = require ('mysql');

const app = express();
const port = process.env.PORT || 5500

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

//MySQL
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'db_order'
})

// Get all orders  /orders
app.get('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from orders', (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// GET orders by ID  /orders
app.get('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from orders WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// DELETE a records  /orders
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from orders WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(`Order with the Record ID: ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }

        })
    })
})

// ADD/POST a record  /orders
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body
        connection.query('INSERT INTO orders SET ?', params, (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(`Order with the Record ID: ${params.name} has been added.`)
            } else {
                console.log(err)
            }

        })
    })
})

// UPDATE a record  /orders
app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body
        const { id, name, size, amount, prize } = req.body

        connection.query('UPDATE orders SET name = ?, size = ?, amount = ?, prize = ? WHERE id =?', [name,size,amount,prize,id], (err, rows) => {
            connection.release() //return the connection to pool

            if(!err) {
                res.send(`Order with the name: ${name} has been Updated.`)
            } else {
                console.log(err)
            }

        })
    })
})










//Listen on environment port or 5500
app.listen(port, () => console.log('Listen on port ${port}'))
