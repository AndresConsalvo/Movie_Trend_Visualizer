import React, { useEffect, useReducer, useState } from "react";
// import Axios from "axios";
// import LineChart from "../LineChart";
import "../App.css";
import GenerateGraph from "./GenerateGraph";

import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

function App() {
  // const [isLoading, setLoading] = React.useState(true);
  // const [query3Data, setQuery3Data] = React.useState([]);
  // const [query3GraphData, setQuery3GraphData] = React.useState([]);

  // React.useEffect(() => {
  //   Axios.get('http://localhost:3001/profitpercentage/yearly').then((response) => {
  //     console.log(response.data);
  //     setQuery3Data(response.data);
  //     generateData();
  //     setLoading(false);
  //   });
  // }, []);

  // function generateData() {
  //   const chartData = [];
  //   for (let i = 0; i < query3Data.length; i++) {
  //     let year = query3Data.at(i).YEAR;
  //     let value = query3Data.at(i).PROFITPERCENTAGE;

  //     chartData.push({
  //       label: year,
  //       value,
  //       tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${value}`
  //     });
  //   }
  //   setQuery3GraphData(chartData);
  // }

  // if (isLoading) {
  //   console.log('Loading');
  //   return <div className="App">Loading...</div>;
  // }

  // pass the height, width, and data as props to <LineChart />
  // data object contains label (X-Axis) and value (Y-Axis) as well as the tooltipContent we want to show hovering over the chart

  // Format of the const: link, y, x, body
  const graphData = [
    ['http://localhost:3001/englishrevenueavg/yearly', 'http://localhost:3001/englishrevenueavg/monthly', 'YEAR', 'MONTH', 'AVG(REVENUE)', 'BLA BLA BLA'],
    ['http://localhost:3001/nonenglishrevenueavg/yearly', 'http://localhost:3001/nonenglishrevenueavg/monthly', 'YEAR', 'MONTH',  'AVG(REVENUE)', 'BLA BLA BLA'],
    ['http://localhost:3001/profitpercentage/yearly', 'http://localhost:3001/profitpercentage/monthly', 'YEAR', 'MONTH',  'PROFITPERCENTAGE', 'Budget and revenue information weren\'t provided for all movies, so those movies had to be filtered out. Our movie data source wasn\'t perfect, as some movies had millions of dollars in budget but less than one hundred in revenue. Consequently, outliers (identified by being located outside of 1.5 times the IQR) were removed. Prior to 1998, many of the years only had a few movies that provided movie financial information. Thus, these years were not considered because basing a year\'s performance on three movies would not yield reliable results.'],
    ['http://localhost:3001/malerolepercentage/yearly', 'http://localhost:3001/malerolepercentage/monthly', 'YEAR', 'MONTH',  'MALEPERCENTAGE', 'BLA BLA BLA'],
    ['http://localhost:3001/femalerolepercentage/yearly', 'http://localhost:3001/femalerolepercentage/monthly', 'YEAR', 'MONTH',  'MALEPERCENTAGE', 'BLA BLA BLA']
    // ['http://localhost:3001/nonenglishrevenueavg/yearly', 'http://localhost:3001/nonenglishrevenueavg/yearly', 'YEAR', 'MONTH',  'ENGLISHREVENEUEAVG', 'BLA BLA BLA']
    // ['http://localhost:3001/nonenglishrevenueavg/yearly', 'http://localhost:3001/nonenglishrevenueavg/yearly', 'YEAR', 'MONTH',  'ENGLISHREVENEUEAVG', 'BLA BLA BLA']
  ]
    
  const [query,setQuery]=useState({value: 0});

  const handleQuery=(e)=>{    
    console.log(e);
    let updatedQuery = {};
    updatedQuery = {value: e};
    setQuery(query => ({
      ...query,
      ...updatedQuery
    }));
  }
  const [granularity,setGranularity]=useState({value: 0});



  const handleGranularity=(e)=>{    
    console.log(e);    
    let updatedGranularity = {};
    updatedGranularity = {value: e};
    setGranularity(granularity => ({
      ...granularity,
      ...updatedGranularity
    }))
  }  
  
  // try{
  //   console.log("Entering")
  //   queries = query.value
  //   gran = granularity.value
  // }
  // catch{
  //   console.log("Ent")
  //   queries = query
  //   gran = granularity
  // }
  
  // useEffect(() => {
  //   document.title = query.value
  // });

  const [, forceUpdate] = useReducer (x => x + 1, 0);

  function handleClick() {
    console.log("Something should happen now!")
    forceUpdate();
  }

  return (
    <div className="home">
      <DropdownButton
      style = {{marginLeft: 110}}
      alignRight
      title="Select Query"      
      id="query"
      onSelect={handleQuery}
        >
        <Dropdown.Item eventKey="0">Success rate of Movie vs. Language(English)</Dropdown.Item>
        <Dropdown.Item eventKey="1">Success rate of Movie vs. Language(Non-English)</Dropdown.Item>
        <Dropdown.Item eventKey="2">Population Percentage vs. Time</Dropdown.Item>          
        <Dropdown.Item eventKey="3">Average amount of Male Over Time</Dropdown.Item>         
        <Dropdown.Item eventKey="4">Average amount of Female Over Time</Dropdown.Item>  
        <Dropdown.Item eventKey="5">Tracking Popularity of Genres Over Time</Dropdown.Item>
        <Dropdown.Item eventKey="6">Production Company Dominance Over Time</Dropdown.Item>      
      </DropdownButton>
      <DropdownButton
      style = {{marginLeft: 670, marginTop: 30}}
      alignRight
      title="Select Time Granuality"      
      id="time"
      onSelect={handleGranularity}
        >
        <Dropdown.Item eventKey="1">Monthly</Dropdown.Item>
        <Dropdown.Item eventKey="0" defaultChecked='TRUE'>Yearly</Dropdown.Item>              
      </DropdownButton>
      {/* <h4 style={{marginTop: 30}}>{value}</h4> */}
      <div style ={{marginTop: 40}}>
        {/* <GenerateGraph link = 'http://localhost:3001/englishrevenueavg/yearly' x = 'PROFITPERCENTAGE' y = 'YEAR' title = "Profit Percentage" 
          body = "Budget and revenue information weren't provided for all movies, so those movies had to be filtered out. Our movie data source wasn't perfect, as some movies had millions of dollars in budget but less than one hundred in revenue. Consequently, outliers (identified by being located outside of 1.5 times the IQR) were removed. Prior to 1998, many of the years only had a few movies that provided movie financial information. Thus, these years were not considered because basing a year's performance on three movies would not yield reliable results."/> */}          
          <GenerateGraph link = {graphData[parseInt(query.value)][parseInt(granularity.value)]} y = {graphData[parseInt(query.value)][2 + parseInt(granularity.value)]} x = {graphData[parseInt(query.value)][4]} body = {graphData[parseInt(query.value)][5]} />          
          <button onClick={handleClick}>Refresh</button>
          {/* <GenerateGraph link = {graphData[parseInt(queries)][parseInt(gran)]} y = {graphData[parseInt(queries)][2]} x = {graphData[parseInt(queries)][3]} body = {graphData[parseInt(queries)][4]} />           */}
      </div>      
      {/* <div class="container">
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
      </div> */}
    </div>
  );
}

export default App;