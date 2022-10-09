const express = require('express');
const mysql   = require('mysql');
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName FROM q_quotes NATURAL JOIN q_author GROUP BY authorId`;
  let sql2 = `SELECT DISTINCT category FROM q_quotes`;
  let rows = await getData(sql);
  let rows2 = await getData(sql2);
  console.log(rows);
  res.render('index', {"rows":rows, "rows2":rows2});
});

app.get("/search", async (req, res) =>{
let word = req.query.keyword;
let sql = `SELECT authorId, firstName, lastName, quote FROM q_quotes NATURAL JOIN q_author WHERE quote LIKE ?`; 
let params = [`%${word}%`]

if(req.query.authorId) {
  sql += " AND authorId = ? ";
  params.push(req.query.authorId);
}

if(req.query.category) {
  sql += " AND category = ? ";
  params.push(req.query.category);
}
let rows = await getData(sql, params);
// console.log(rows)
res.render('results', {"rows":rows});
});

app.get('/authorInfo', async (req, res) => {
  let id = req.query.authorId;
  let sql = `SELECT * From q_author WHERE authorId LIKE ?`;
  let params = [`%${id}%`]
   if(req.query.authorId){
    sql += "AND authorId = ? ";
    params.push(req.query.authorId);
  }
  let rows = await getData(sql, params);
  console.log(rows);
  res.send(rows);
});


async function getData(sql, params){

return new Promise (function (resolve, reject) {
let conn = dbConnection();

conn.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});

}//getData


//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 40,
      host: "tviw6wn55xwxejwj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "x0ngv860aiggskna",
      password: "ti8oofdy8raufa31",
      database: "hvixn85iki0fbmzu"

   }); 

   return pool;

} //dbConnection

app.listen(3000, () => {
   console.log('server started');
});