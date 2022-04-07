import React from "react";
import LineChart from "../LineChart";
import logo from "../logo.svg";
import "../App.css";

function App() {
  const [data, setData] = React.useState([null]);
  const [data2, setData2] = React.useState(null);
  const [data3, setData3] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((data) => setData(data.response));
  }, []);

  React.useEffect(() => {
    fetch("/profitpercentage/yearly")
      .then((data2) => setData2(data2.response2));
  }, []);

  React.useEffect(() => {
    console.log(data);
    console.log(data2);
  }, []);

  // React.useEffect(() => {
  //   generateData();
  // }, []);


  function generateData() {
    const chartData = [];
    for (let i = 0; i < data2.length; i++) {
      let year = data2[i][1];
      let profit_percentage = data2[i][0];

      chartData.push({
        label: year,
        profit_percentage,
        tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${profit_percentage}`
      });
    }
    setData3(chartData)
  }

  //     // pass the height, width, and data as props to <LineChart />
  //     // data object contains label (X-Axis) and value (Y-Axis) as well as the tooltipContent we want to show hovering over the chart
  //     <div className="App">
  //       <button onClick={regenerateData}>Change Data</button>
  //       <LineChart data={data} width={400} height={300} />
  //     </div>

  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-6">
            <h1 class="font-weight-light">{!data ? "Loading..." : data}</h1>
          </div>
          <div class="col-lg-6">
            <h1 class="font-weight-light">Profit Percentage</h1>
            <dl>
              <dt>Considerations:</dt>
              <div class="col-lg-auto">
                <dd>- Budget and revenue information weren't provided for all movies, so those movies had to be filtered out.</dd>
                <dd>
                  - Our movie data source wasn't perfect, as some movies had millions of dollars in budget but less than one hundred in revenue.
                  Consequently, outliers (identified by being located outside of 1.5 times the IQR) were removed.
                </dd>
                <dd>
                  - Prior to 1998, many of the years only had a few movies that provided movie financial information.
                  Thus, these years were not considered because basing a year's performance on three movies would not yield reliable results.
                </dd>
              </div>
              <dt>
                Applications:
              </dt>
            </dl>
          </div>
        </div>
      </div>
    </div>

    // {/* <div className="App">
    // <header className="App-header">
    //   <img src={logo} className="App-logo" alt="logo" />
    //   <p>{!data ? "Loading..." : data}</p>
    // </header>
    // </div> */}
  );
}

export default App;


// // Code sourced from Urvashi in Better Programming
// // https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

// import React, { useState, useEffect } from 'react';
// import LineChart from './LineChart';
// import './App.css';

// function App() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     regenerateData();
//   }, []);

//   function regenerateData() {
//     const chartData = [];
//     for (let i = 0; i < 20; i++) {
//       const value = Math.floor(Math.random() * i + 3);
//       chartData.push({
//         label: i,
//         value,
//         tooltipContent: `<b>x: </b>${i}<br><b>y: </b>${value}`
//       });
//     }
//     setData(chartData)
//   }

//   return (
//     // generates random data and sets the component data state on first mount and then every time the Chace Data button is clicked.
//     // pass the height, width, and data as props to <LineChart />
//     // data object contains label (X-Axis) and value (Y-Axis) as well as the tooltipContent we want to show hovering over the chart
//     <div className="App">
//       <button onClick={regenerateData}>Change Data</button>
//       <LineChart data={data} width={400} height={300} />
//     </div>
//   );
// }

// export default App;