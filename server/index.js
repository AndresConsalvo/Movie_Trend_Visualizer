// Node backend creation referenced from Reed Barger at freeCodeCamp
// https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

// Use Express to create a simple web server for us which runs on port 3001
// install Express i terminal as dependency to use it: npm i express

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const oracledb = require('oracledb');

let response; // variable I put in to test passing to client

// oracledb connection code taken from Oracle
// https://www.oracle.com/database/technologies/appdev/quickstartnodeonprem.html
async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection({
      user: "laurachang",
      password: "hC4gXYb7ky9SnOdcOsmaTQFr",
      connectionString: "//oracle.cise.ufl.edu/orcl"
    });

    console.log("Successfully connected to Oracle Database");

    // // Create a table

    // await connection.execute(`begin
    //                               execute immediate 'drop table todoitem';
    //                               exception when others then if sqlcode <> -942 then raise; end if;
    //                             end;`);

    // await connection.execute(`create table todoitem (
    //                               id number generated always as identity,
    //                               description varchar2(4000),
    //                               creation_ts timestamp with time zone default current_timestamp,
    //                               done number(1,0),
    //                               primary key (id))`);

    // // Insert some data

    // const sql = `insert into todoitem (description, done) values(:1, :2)`;

    // const rows =
    //   [["Task 1", 0],
    //   ["Task 2", 0],
    //   ["Task 3", 1],
    //   ["Task 4", 0],
    //   ["Task 5", 1]];

    // let result = await connection.executeMany(sql, rows);

    // console.log(result.rowsAffected, "Rows Inserted");

    // connection.commit();

    // Now query the rows back

    const result = await connection.execute(
      `select title from movies`,
      [],
      { maxRows: 1 });
    console.log(result.rows);
    response = result.rows;

    // result = await connection.execute(
    //   `select description, done from todoitem`,
    //   [],
    //   { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });

    // const rs = result.resultSet;
    // let row;

    // while ((row = await rs.getRow())) {
    //   if (row.DONE)
    //     console.log(row.DESCRIPTION, "is done");
    //   else
    //     console.log(row.DESCRIPTION, "is NOT done");
    // }

    // await rs.close();

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();

// Have Node serve the files for our build React app
// Allows Node to access our build React project using the express.static function for static files
app.use(express.static(path.resolve(__dirname, '../client/build')));

// If React app makes GET request to /api route, respond using res within our JSON data
// Test by visiting http://localhost:3001/api in browser
app.get("/api", (req, res) => {
  res.json({ response });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});