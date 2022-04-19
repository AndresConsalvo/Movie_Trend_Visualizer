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
    Axios.get('http://localhost:3001/malerolepercentage/yearly').then((response) => {
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
      let value = query3Data.at(i)["MALEPERCENTAGE"];

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
              <h3 style={{marginLeft: 100, marginBottom: 30}}>Percentage of Male Cast vs. Time</h3>     
              <div style={{display: "flex", flexDirection: "row"}}>
                <p style={{marginTop: 150, transform: [{ rotate: '90deg' }]}}>Percentage of Male Cast</p>
                <LineChart data={query3GraphData} width={400} height={300} />
              </div>                 
              <p style={{marginLeft: 350, marginTop: 20}}>Time</p> 
            </div>
            <div class="col-lg-6">
              <h1 class="font-weight-light">PERCENTAGE OF MALE CAST</h1>
              <dl>
                <dt>Considerations</dt>
                <div class="col-lg-auto">
                  <dd>- Only years with greater than 30 movies released are included. Years with a very small number of released movies are excluded to avoid the case of one or two movies dominating a data point and thus affecting a data point in unpredictable ways. </dd>
                  <dd>
                    - To align the scales of the months and years X-axis (time), collection of movie information does not start until 1926, which is the start of the yearly information. 
                  </dd>
                  <dd>
                    -	There weren’t enough movies with a release date that hadn’t yet been released to provide reliable data, so those too were excluded.
                  </dd>
                </div>
                <dt>
                  Applications
                </dt>
                <dd>
                Value for this graph is raised from a societal view. The trend of the percentage of female cast members over time can serve as a metric of changes in inclusivity and be further compared to diversity metrics outside of the movie industry.
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