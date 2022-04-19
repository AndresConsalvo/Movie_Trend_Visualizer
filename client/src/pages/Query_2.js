import React from "react";
import Axios from "axios";
import LineChart from "../LineChart";
import "../App.css";

import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
} from '@progress/kendo-react-charts';
import '@progress/kendo-theme-default/dist/all.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function Query_1() {
  const [isLoading, setLoading] = React.useState(true);
  const [query3Data, setQuery3Data] = React.useState([]);
  const [query3GraphData, setQuery3GraphData] = React.useState([]);

  React.useEffect(() => {
    Axios.get('http://localhost:3001/nonenglishrevenueavg/yearly').then((response) => {
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
  // const [query2AData, setQuery2AData] = React.useState([]);
  //   const [query2BData, setQuery2BData] = React.useState([]);

  //   var enAvgRev = {
  //       English: [],
  //   };
  //   var enYr = {
  //       English: [],
  //   };

  //   var nonEnAvgRev = {
  //       Other: [],
  //   };
  //   var nonEnYr = {
  //       Other: [],
  //   };

  //   React.useEffect(() => {
  //       Axios.get('http://localhost:3001/englishrevenueavg/yearly').then((response) => {
  //           setQuery2AData(response.data);
  //       });
  //   }, []);

  //   React.useEffect(() => {
  //       Axios.get('http://localhost:3001/nonenglishrevenueavg/yearly').then((response) => {
  //           setQuery2BData(response.data);
  //       });
  //   }, []);

  //   React.useEffect(() => {
  //       generateData();
  //   }, [query2AData, query2BData]);

  //   React.useEffect(() => {
  //       Render();
  //   }, [enAvgRev, nonEnAvgRev, enYr, nonEnYr]);

  //   function generateData() {
  //       for (var i = 0; i < query2AData.length; i++)
  //       {
  //           enAvgRev.English.push(query2AData[i].AVGREVENUE);
  //           enYr.English.push(query2AData[i].YEAR);
  //       }

  //       for (var i = 0; i < query2BData.length; i++)
  //       {
  //           nonEnAvgRev.Other.push(query2BData[i].AVGREVENUE);
  //           nonEnYr.Other.push(query2BData[i].YEAR);
  //       }
  //   }

  //   const categories = enYr.English;
  //   const series = [
  //       {
  //           name: 'English',
  //           data: enAvgRev.English,
  //       },
  //       {
  //           name: 'Other',
  //           data: nonEnAvgRev.Other,
  //       },
  //   ];

  //   const ChartContainer = () => (
  //       <>
  //           <div className="row mb-3">
  //               <div className="k-card">
  //                   <Chart
  //                       pannable={{
  //                           lock: 'y',
  //                       }}
  //                       zoomable={{
  //                           mousewheel: {
  //                               lock: 'y',
  //                           },
  //                           selection: {
  //                               lock: 'y',
  //                           },
  //                       }}
  //                       style={{
  //                           height: 500,
  //                           width: 800,
  //                       }}
  //                   >
  //                       <ChartTitle text="Financial Success Based on Original Language" />
  //                       <ChartLegend position="top" orientation="horizontal" />
  //                       <ChartValueAxis>
  //                           <ChartValueAxisItem
  //                               title={{
  //                                   text: 'Average Earnings',
  //                               }}
  //                           />
  //                       </ChartValueAxis>

  //                       <ChartCategoryAxis>
  //                           <ChartCategoryAxisItem
  //                               title={{ text: 'Year' }}
  //                               categories={categories}
  //                           />
  //                       </ChartCategoryAxis>
  //                       <ChartSeries>
  //                           {series.map((item, idx) => (
  //                               <ChartSeriesItem
  //                                   key={idx}
  //                                   type="line"
  //                                   style="smooth"
  //                                   tooltip={{
  //                                       visible: true,
  //                                   }}
  //                                   data={item.data}
  //                                   name={item.name}
  //                               />
  //                           ))}
  //                       </ChartSeries>
  //                   </Chart>
  //               </div>
  //           </div>
  //       </>
  //   );

  //   function Render() {
  //       console.log("here");
  //       return (
  //           <ChartContainer />
  //       );
  //   }
    
  //   console.log("true");
  return (
    <Router>
      <div className="home">        
        <div class="container">
          <div class="row align-items-start my-5">
            <div class="col-lg-6">     
              {/* <ChartContainer />                    */}
              {/* <LineChart data={query3GraphData} width={500} height={300} /> */}
              <h3 style={{marginLeft: 100, marginBottom: 30}}>Average Revenue(Non-English) vs. Time</h3>     
              <div style={{display: "flex", flexDirection: "row"}}>
                <p style={{marginTop: 150, transform: [{ rotate: '90deg' }]}}>Average Revenue<br />(Non-English)</p>
                <LineChart data={query3GraphData} width={400} height={300} />
              </div>                 
              <p style={{marginLeft: 350, marginTop: 20}}>Time</p> 
            </div>
            <div class="col-lg-6">
              <h1 class="font-weight-light">AVERAGE REVENUE OF FILMS (NON-ENGLISH)</h1>
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
    </ Router>
  );
}

export default Query_1;