import React from "react";
import Axios from "axios";
import LineChart from "../LineChart";
import "../App.css";

function App() {
  const [isLoading, setLoading] = React.useState(true);
  const [data1, setData] = React.useState([]);
  const [data2, setData2] = React.useState([]);
  const [data3, setData3] = React.useState([]);

  React.useEffect(() => {
    Axios.get('http://localhost:3001/api').then((response) => {
      console.log(response.data)
      setData(response.data);
    });

    Axios.get('http://localhost:3001/profitpercentage/yearly').then((response) => {
      console.log(response.data);
      setData2(response.data);
      generateData();
      setLoading(false);
    });
  }, []);

  function generateData() {
    const chartData = [];
    for (let i = 0; i < data2.length; i++) {
      let year = data2.at(i).YEAR;
      let value = data2.at(i).PROFITPERCENTAGE;

      chartData.push({
        label: year,
        value,
        tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${value}`
      });
    }
    setData3(chartData);
  }

  if (isLoading) {
    console.log('Loading');
    return <div className="App">Loading...</div>;
  }

  // pass the height, width, and data as props to <LineChart />
  // data object contains label (X-Axis) and value (Y-Axis) as well as the tooltipContent we want to show hovering over the chart
  console.log("render");
  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-start my-5">
          <div class="col-lg-6">
            <LineChart data={data3} width={400} height={300} />
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
                Applications
              </dt>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;