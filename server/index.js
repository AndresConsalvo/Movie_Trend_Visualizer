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
let response2;

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

    const result = await connection.execute(
      `select title from laurachang.movies`,
      [],
      { maxRows: 1 });
    console.log(result.rows);
    response = result.rows;

    const result2 = await connection.execute(
      // WITH profit_percentage(profitpercentage, releasedate)
      //     AS (SELECT (revenue-budget)/revenue, releasedate
      //     FROM movies
      //     WHERE  budget <> 0 and revenue <> 0)
      // SELECT AVG(profitpercentage), extract(year FROM releasedate) as year
      //     FROM profit_percentage
      //     GROUP BY EXTRACT(year FROM releasedate)
      //     HAVING COUNT(profilePercentage) > 100
      //     ORDER BY year ASC;

      // Outlier code sourced from https://towardsdatascience.com/using-sql-to-detect-outliers-aff676bb2c1a
      // Values outside 1.5 * IQR removed
      `with ordered_profit_percentage AS (
        SELECT
            (revenue-budget)/revenue as profitPercentage,
            releaseDate,
            ROW_NUMBER() OVER (ORDER BY (revenue-budget)/revenue ASC) AS row_n
        FROM movies
        WHERE budget <> 0 AND revenue <> 0
        ),
        iqr AS (
        SELECT
            profitPercentage,
          releaseDate,
          (
            SELECT profitPercentage AS quartile_break
            FROM ordered_profit_percentage
            WHERE row_n = FLOOR((SELECT COUNT(*)
              FROM ordered_profit_percentage)*0.75)
              ) AS q_three,
          (
            SELECT profitPercentage AS quartile_break
            FROM ordered_profit_percentage
            WHERE row_n = FLOOR((SELECT COUNT(*)
              FROM ordered_profit_percentage)*0.25)
              ) AS q_one,
          1.5 * ((
            SELECT profitPercentage AS quartile_break
            FROM ordered_profit_percentage
            WHERE row_n = FLOOR((SELECT COUNT(*)
              FROM ordered_profit_percentage)*0.75)
              ) - (
              SELECT profitPercentage AS quartile_break
              FROM ordered_profit_percentage
              WHERE row_n = FLOOR((SELECT COUNT(*)
                FROM ordered_profit_percentage)*0.25)
              )) AS outlier_range
          FROM ordered_profit_percentage
        ),
        outlier_data AS (
        SELECT releaseDate, profitPercentage
        FROM iqr
        WHERE profitPercentage >= ((SELECT MAX(q_three)
          FROM iqr) +
          (SELECT MAX(outlier_range)
            FROM iqr)) OR
            profitPercentage <= ((SELECT MAX(q_one)
          FROM iqr) -
          (SELECT MAX(outlier_range)
            FROM iqr))
        ),
        discarded_outliers AS (
        SELECT profitPercentage, releaseDate FROM ordered_profit_percentage
        MINUS
        SELECT profitPercentage, releaseDate from outlier_data
        )
        SELECT AVG(profitPercentage), EXTRACT(year FROM releaseDate) AS YEAR
        FROM discarded_outliers
        GROUP BY EXTRACT(year FROM releaseDate)
        HAVING COUNT(profitPercentage) > 100
        ORDER BY year ASC`,
      []);
    console.log(result2.rows)
    response2 = result2.rows;

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

app.get("/profitpercentage/yearly", (req, res) => {
  res.json({ response2 });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});