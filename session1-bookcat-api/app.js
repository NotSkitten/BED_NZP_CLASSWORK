
const express = require('express');
const app = express();

app.use(express.json());

const sql = require("mssql");
const dbconfig = require("./dbconfig");


app.get('/', (req, res) => {
    res.send('Welcome to the Book Category API');
});


app.get('/about', (req, res) => {
    res.send("Hi. I am learning back-end development");
});


app.get('/db-test', async (req, res) => {
    try {
        const pool = await sql.connect(dbconfig);

        const result = await pool.request()
            .query('SELECT COUNT(*) AS Total FROM Author');

        await pool.close();

        res.json({
            connected: true,
            authors: result.recordset[0].Total
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            connected: false,
            error: err.message
        });
    }
});


app.get('/categories', (req, res) => {
    res.json([
        {id: 1, name: 'Fiction'},
        {id: 2, name: 'Non-Fiction'},
        {id: 3, name: 'Biography'}
    ]);
});


app.get("/authors", async (req, res) => {
    try {
        const connection = await sql.connect(dbconfig);

        const result = await connection
            .request()
            .query("SELECT AuthorID, Name FROM Author");

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});

// tutorial 1

app.get('/authors/:id', async (req, res) => {
    const authorId = parseInt(req.params.id);
    if (isNaN(authorId)) {
        return res.status(400).json({error: 'Invalid id'});
    }
    let connection;
    try {
        connection = await sql.connect(dbconfig);
        const request = connection.request();
        request.input('id', authorId);
        const sqlQuery = `SELECT AuthorID, Name FROM Author WHERE AuthorID = @id` ;
        const result = await request.query(sqlQuery);
        if (result.recordset.length === 0) {
            return res.status(404).json({error: 'Not found'});
        }
        res.status(200).json(result.recordset[0]);
    }   catch (err) {
        res.status(500).json({error: 'Database error'});
    }   finally {
        if (connection) await connection.close();
    }
});

// tutorial 2

app.post('/echo/:id', (req, res) => {
    console.log('params: ', req.params);
    console.log('query: ', req.query);
    console.log('body: ', req.body);
    res.status(200).json({ok: true});
});




