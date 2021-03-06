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
    Axios.get('http://localhost:3001/englishrevenueavg/yearly').then((response) => {
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
      let value = query3Data.at(i)["AVG(REVENUE)"];

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
              <h3 style={{marginLeft: 100, marginBottom: 30}}>Average Revenue(English) vs. Time</h3>     
              <div style={{display: "flex", flexDirection: "row"}}>
                <p style={{marginTop: 150, transform: [{ rotate: '90deg' }]}}>Average Revenue<br />(English)</p>
                <LineChart data={query3GraphData} width={400} height={300} />
              </div>                 
              <p style={{marginLeft: 350, marginTop: 20}}>Time</p>     
            </div>
            <div class="col-lg-6">
              <h1 class="font-weight-light">AVERAGE REVENUE OF FILMS (ENGLISH)</h1>
              <dl>
                <dt>Considerations:</dt>
                <div class="col-lg-auto">
                  <dd>-	Required to have more than 15 English movies released in a year to be included to avoid very small datasets skewing data. </dd>
                  <dd>
                      -	When choosing the monthly granularity, we consider movies starting from the beginning of the yearly graph (year 2000) for more fluid integration/connectiveness. Original intention was to have specific languages outside of English shown, but there weren???t enough movies for a specific language to model.
                  </dd>
                  {/* <dd>
                    - Prior to 1998, many of the years only had a few movies that provided movie financial information.
                    Thus, these years were not considered because basing a year's performance on three movies would not yield reliable results.
                  </dd> */}
                </div>
                <dt>
                  Applications
                </dt>
                <dd>
                - A diversity metric to see how society responds to growing industries outside of the familiar English domain, how welcoming the society has been to different cultures and their depictions of the world.
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