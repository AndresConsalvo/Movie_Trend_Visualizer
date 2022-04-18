// Node backend creation referenced from Reed Barger at freeCodeCamp
// https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/

// Use Express to create a simple web server for us which runs on port 3001
// install Express i terminal as dependency to use it: npm i express

const path = require('path');
const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

app.use(cors());

let query1;
let query2a;
let query2aMonthly;
let query2b;
let query2bMonthly;
let query3;
let query3Monthly;
let query4;
let query4Monthly;
let query5a;
let query5aMonthly;
let query5b;
let query5bMonthly;

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

    const resultQ2b = await connection.execute(
      `SELECT AVG(revenue), EXTRACT(year FROM releasedate)as year
        FROM laurachang.movies 
        WHERE revenue > 0 AND EXTRACT(year FROM releasedate) IS NOT NULL AND ogLangID <> 'en'
        GROUP BY EXTRACT(year FROM releasedate)
        HAVING count(title) > 15
        ORDER BY year ASC`,
    []);
    query2b = resultQ2b.rows;

    const resultQ2bMonthly = await connection.execute(
      `SELECT AVG(revenue), EXTRACT(month FROM releasedate) AS month, EXTRACT(year FROM releasedate) AS year
        FROM laurachang.movies 
        WHERE revenue > 0 AND EXTRACT(year FROM releasedate) IS NOT NULL AND ogLangID <> 'en'
        GROUP BY EXTRACT(year FROM releasedate), EXTRACT(month FROM releasedate)
        HAVING EXTRACT(year FROM releasedate) >= 2000
        ORDER BY year ASC`,
    []);
    query2bMonthly = resultQ2bMonthly.rows;
    
    // Year > 2000 to match results from non english movies
    const resultQ2a = await connection.execute(
      `SELECT AVG(revenue), EXTRACT(year FROM releasedate)as year
        FROM laurachang.movies 
        WHERE revenue > 0 AND EXTRACT(year FROM releasedate) IS NOT NULL AND ogLangID = 'en'
        GROUP BY EXTRACT (year FROM releasedate)
        HAVING EXTRACT (year FROM releasedate) >= 2000
        ORDER BY year ASC`,
    []);
    query2a = resultQ2a.rows;

    const resultQ2aMonthly = await connection.execute(
      `SELECT AVG(revenue), EXTRACT(month FROM releasedate) AS month, EXTRACT(year FROM releasedate)AS year
        FROM laurachang.movies
        WHERE revenue > 0 AND EXTRACT(year FROM releasedate) IS NOT NULL AND ogLangID = 'en'
        GROUP BY EXTRACT (year FROM releasedate), EXTRACT(month FROM releasedate)
        HAVING EXTRACT (year FROM releasedate) >= 2000
        ORDER BY year ASC`,
    []);
    query2aMonthly = resultQ2aMonthly.rows;

    const resultQ3 = await connection.execute(
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
        FROM laurachang.movies
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
        SELECT AVG(profitPercentage)*100 as profitPercentage, EXTRACT(year FROM releaseDate) AS YEAR
        FROM discarded_outliers
        GROUP BY EXTRACT(year FROM releaseDate)
        HAVING COUNT(profitPercentage) > 100
        ORDER BY year ASC`,
    []);
    query3 = resultQ3.rows;

    const resultQ3Monthly = await connection.execute(
      `with ordered_profit_percentage AS (
        SELECT
            (revenue-budget)/revenue as profitPercentage,
            releaseDate,
            ROW_NUMBER() OVER (ORDER BY (revenue-budget)/revenue ASC) AS row_n
        FROM laurachang.movies
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
        SELECT AVG(profitPercentage)*100 as profitPercentage, EXTRACT(month FROM releaseDate) AS month, EXTRACT(year FROM releaseDate) AS YEAR
        FROM discarded_outliers
        GROUP BY EXTRACT(year FROM releaseDate), EXTRACT(month FROM releaseDate)
        HAVING EXTRACT(year FROM releaseDate) >= 1998
        ORDER BY year ASC`,
    []);
    query3Monthly = resultQ3Monthly.rows;

    const resultQ4 = await connection.execute(
      `SELECT COUNT(*) AS count, genrename, AVG(movies.revenue) AS earnings, EXTRACT(YEAR FROM movies.releasedate) AS year
        FROM laurachang.movies, laurachang.genres 
        WHERE movies.mID = genres.mID AND movies.revenue <> 0 AND movies.releasedate is not null
        GROUP BY EXTRACT(YEAR FROM movies.releasedate), genres.genrename
        HAVING COUNT(*) > 20
        ORDER BY YEAR DESC`,
    []);
    query4 = resultQ4.rows;

    const resultQ4Monthly = await connection.execute(
      `SELECT COUNT(*) AS count, genrename, AVG(movies.revenue) AS earnings, EXTRACT(MONTH FROM movies.releasedate) AS MONTH, EXTRACT(YEAR FROM movies.releasedate) AS year
        FROM laurachang.movies, laurachang.genres 
        WHERE movies.mID = genres.mID AND movies.revenue <> 0 AND movies.releasedate is not null
        GROUP BY EXTRACT(YEAR FROM movies.releasedate), EXTRACT(MONTH FROM movies.releasedate), genres.genrename
        HAVING COUNT(*) > 5
        ORDER BY YEAR DESC`,
    []);
    query4Monthly = resultQ4Monthly.rows;

    const resultQ5a = await connection.execute(
      `WITH femaleCastCt(femaleCt, year) AS
          (SELECT count(castID) AS femaleCastCt, EXTRACT (year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 1
          GROUP BY EXTRACT (year FROM releaseDate)
          HAVING COUNT(DISTINCT movies.mid) > 30
          ORDER  BY year ASC),
      maleCastCt(maleCt, year) AS
          (SELECT count(castID) AS maleCastCt, EXTRACT (year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 2
          GROUP BY EXTRACT (year FROM releaseDate)
          HAVING COUNT(DISTINCT movies.mid) > 30
          ORDER  BY year ASC)
      SELECT maleCt/(femaleCt + maleCt) AS malePercentage, femaleCastCt.year
          FROM femaleCastCt, maleCastCt
          WHERE femaleCastCt.year = maleCastCt.year`,
    []);
    query5a = resultQ5a.rows;

    const resultQ5aMonthly = await connection.execute(
      `WITH femaleCastCt(femaleCt, month, year) AS
          (SELECT count(castID) AS femaleCastCt, EXTRACT(month FROM releaseDate) AS month, EXTRACT(year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 1
          GROUP BY EXTRACT (year FROM releaseDate), EXTRACT(month FROM releaseDate)
          HAVING EXTRACT(year FROM releaseDate) >= 1926
          ORDER  BY year ASC),
      maleCastCt(maleCt, month, year) AS
          (SELECT count(castID) AS maleCastCt, EXTRACT(month FROM releaseDate) AS month, EXTRACT(year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 2
          GROUP BY EXTRACT(year FROM releaseDate), EXTRACT(month FROM releaseDate)
          HAVING EXTRACT(year FROM releaseDate) >= 1926
          ORDER  BY year ASC)
      SELECT maleCt/(femaleCt + maleCt) AS malePercentage, femaleCastCt.month, femaleCastCt.year
          FROM femaleCastCt, maleCastCt
          WHERE femaleCastCt.year = maleCastCt.year AND femaleCastCt.month = maleCastCt.month`,
    []);
    query5aMonthly = resultQ5aMonthly.rows;

    const resultQ5b = await connection.execute(
      `WITH femaleCastCt(femaleCt, year) AS
          (SELECT count(castID) AS femaleCastCt, EXTRACT (year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 1
          GROUP BY EXTRACT (year FROM releaseDate)
          HAVING COUNT(DISTINCT movies.mid) > 30
          ORDER  BY year ASC),
      maleCastCt(maleCt, year) AS
          (SELECT count(castID) AS maleCastCt, EXTRACT (year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 2
          GROUP BY EXTRACT (year FROM releaseDate)
          HAVING COUNT(DISTINCT movies.mid) > 30
          ORDER  BY year ASC)
      SELECT femaleCt/(femaleCt + maleCt) AS femalePercentage, femaleCastCt.year
          FROM femaleCastCt, maleCastCt
          WHERE femaleCastCt.year = maleCastCt.year`,
    []);
    query5b = resultQ5b.rows;

      const resultQ5bMonthly = await connection.execute(
        `WITH femaleCastCt(femaleCt, month, year) AS
          (SELECT count(castID) AS femaleCastCt, EXTRACT(month FROM releaseDate) AS month, EXTRACT(year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 1
          GROUP BY EXTRACT (year FROM releaseDate), EXTRACT(month FROM releaseDate)
          HAVING EXTRACT(year FROM releaseDate) >= 1926
          ORDER  BY year ASC),
        maleCastCt(maleCt, month, year) AS
          (SELECT count(castID) AS maleCastCt, EXTRACT(month FROM releaseDate) AS month, EXTRACT(year FROM releaseDate) AS year
          FROM laurachang.movies, laurachang.cast_member, laurachang.member
          WHERE castID = memberID AND cast_member.mID = movies.mID AND status = 'Released' AND releasedate IS NOT NULL AND gender = 2
          GROUP BY EXTRACT(year FROM releaseDate), EXTRACT(month FROM releaseDate)
          HAVING EXTRACT(year FROM releaseDate) >= 1926
          ORDER  BY year ASC)
        SELECT femaleCt/(femaleCt + maleCt) AS malePercentage, femaleCastCt.month, femaleCastCt.year
          FROM femaleCastCt, maleCastCt
          WHERE femaleCastCt.year = maleCastCt.year AND femaleCastCt.month = maleCastCt.month`,
      []);
      query5bMonthly = resultQ5bMonthly.rows;

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

app.get("/englishrevenueavg/yearly", (req, res) => {
  res.send(query2a);
});

app.get("/englishrevenueavg/monthly", (req, res) => {
  res.send(query2aMonthly);
});

app.get("/nonenglishrevenueavg/yearly", (req, res) => {
  res.send(query2b);
})

app.get("/nonenglishrevenueavg/monthly", (req, res) => {
  res.send(query2bMonthly);
})

app.get("/profitpercentage/yearly", (req, res) => {
  // res.json({ response2 });
  res.send(query3);
});

app.get("/profitpercentage/monthly", (req, res) => {
  res.send(query3Monthly);
});

app.get("/genreearnings/yearly", (req, res) => {
  res.send(query4);
})

app.get("/genreearnings/monthly", (req, res) => {
  res.send(query4Monthly);
})

app.get("/malerolepercentage/yearly", (req, res) => {
  res.send(query5a);
});

app.get("/malerolepercentage/monthly", (req, res) => {
  res.send(query5aMonthly);
});

app.get("/femalerolepercentage/yearly", (req, res) => {
  res.send(query5b);
});

app.get("/femalerolepercentage/monthly", (req, res) => {
  res.send(query5bMonthly);
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});