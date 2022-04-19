import React from "react";
import Axios from "axios";
import LineChart from "../LineChart";
import "../App.css";

function App() {
  const [isLoading, setLoading] = React.useState(true);
  const [query3Data, setQuery3Data] = React.useState([]);
  const [query4Data, setQuery4Data] = React.useState([]);
  const [query3GraphData, setQuery3GraphData] = React.useState([]);
  const [query4GraphData, setQuery4GraphData] = React.useState([]);

  React.useEffect(() => {
    Axios.get('http://localhost:3001/profitpercentage/yearly').then((response) => {
      console.log(response.data);
      setQuery3Data(response.data);
    });
    Axios.get('http://localhost:3001/genreearnings/yearly').then((response) => {
      console.log(response.data);
      setQuery4Data(response.data);
    });
  }, []);

  React.useEffect(() => {
    generateData();
    generateQuery4ChartData();
    setLoading(false);
  }, [query3Data, query4Data]);

  function generateData() {
    const chartData = [];
    for (let i = 0; i < query3Data.length; i++) {
      let year = query3Data.at(i).YEAR;
      let value = query3Data.at(i).PROFITPERCENTAGE;

      chartData.push({
        label: year,
        value,
        tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${value}`
      });
    }
    setQuery3GraphData(chartData);
  }

  function generateQuery4ChartData() {
    const chartData = [];
    for (let i = 0; i < query4Data.length; i++) {
      let year = query4Data.at(i).YEAR;
      let value = query4Data.at(i).EARNINGS;

      chartData.push({
        label: year,
        value,
        tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${value}`
      });
    }
    setQuery4GraphData(chartData);
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
            <LineChart data={query3GraphData} width={400} height={300} />
          </div>
          <div class="col-lg-6">
            <h1 class="font-weight-light">Profit Percentage</h1>
            <dl>
              <dt>Considerations;</dt>
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