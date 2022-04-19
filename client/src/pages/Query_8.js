import React from "react";
import Axios from "axios";
import LineChart from "../LineChart";
import "../App.css";

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function Query_1() {
  const [isLoading, setLoading] = React.useState(true);
  const [query3Data, setQuery3Data] = React.useState([]);
  const [query3GraphData, setQuery3GraphData] = React.useState([]);

  React.useEffect(() => {
    Axios.get('http://localhost:3001/genreearnings/yearly').then((response) => {
      console.log(response.data);
      setQuery3Data(response.data);      
    });
  }, []);

  React.useEffect(() => {
    generateData();
    setLoading(false);
  }, [query3Data,]);

  function generateData() {
    const chartData = [];
    for (let i = 0; i < query3Data.length; i++) {
      let year = query3Data.at(i).YEAR;
      let value = query3Data.at(i)["EARNINGS"];

      chartData.push({
        label: year,
        value,
        tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${value}`
      });
    }
    setQuery3GraphData(chartData);
  }

  if (isLoading) {
    console.log('Loading');
    return <div className="Query_1">Loading...</div>;
  }

  // pass the height, width, and data as props to <LineChart />
  // data object contains label (X-Axis) and value (Y-Axis) as well as the tooltipContent we want to show hovering over the chart
  console.log("render");
  return (
    <Router>
      <div className="home">        
        <div class="container">
          <div class="row align-items-start my-5">
            <div class="col-lg-6">                        
              {/* <LineChart data={query3GraphData} width={400} height={300} /> */}
              <h3 style={{marginLeft: 100, marginBottom: 30}}>Popularity of Genres (In terms of revenue) vs. Time</h3>     
              <div style={{display: "flex", flexDirection: "row"}}>
                <p style={{marginTop: 150, transform: [{ rotate: '90deg' }]}}>Revenue of Genres</p>
                <LineChart data={query3GraphData} width={400} height={300} />
              </div>                 
              <p style={{marginLeft: 350, marginTop: 20}}>Time</p> 
            </div>
            <div class="col-lg-6">
              <h1 class="font-weight-light">EARNINGS PER GENRE</h1>
              <dl>
                <dt><br /><br />Considerations:</dt>
                <div class="col-lg-auto">
                  <dd>- Movies without revenue information are excluded, as we have no way to map the earnings for the Y axis.<br /><br /><br /></dd>
                  {/* <dd>
                    - Our movie data source wasn't perfect, as some movies had millions of dollars in budget but less than one hundred in revenue.
                    Consequently, outliers (identified by being located outside of 1.5 times the IQR) were removed.
                  </dd>
                  <dd>
                    - Prior to 1998, many of the years only had a few movies that provided movie financial information.
                    Thus, these years were not considered because basing a year's performance on three movies would not yield reliable results.
                  </dd> */}
                </div>
                <dt>
                  Applications
                </dt>
                <dd>
                  - From an economic standpoint, it can be useful to check how the success of genres changes seasonally as well as over the years. 
                </dd>
                <dd>
                  - Seeing when a genre tends to earn more can help with timing movie releases.
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </ Router>
  );
}

export default Query_1;