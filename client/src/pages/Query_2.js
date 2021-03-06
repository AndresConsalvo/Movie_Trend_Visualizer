import * as React from 'react';
import Axios from "axios";
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

function Query2() {

  const [query2AData, setQuery2AData] = React.useState([]);
  const [query2BData, setQuery2BData] = React.useState([]);

  var enAvgRev = {
    English: [],
  };
  var enYr = {
    English: [],
  };

  var nonEnAvgRev = {
    Other: [],
  };
  var nonEnYr = {
    Other: [],
  };

  React.useEffect(() => {
    Axios.get('http://localhost:3001/englishrevenueavg/yearly').then((response) => {
      setQuery2AData(response.data);
    });
  }, []);

  React.useEffect(() => {
    Axios.get('http://localhost:3001/nonenglishrevenueavg/yearly').then((response) => {
      setQuery2BData(response.data);
    });
  }, []);

  React.useEffect(() => {
    generateData();
  }, [query2AData, query2BData]);

  React.useEffect(() => {
    Render();
  }, [enAvgRev, nonEnAvgRev, enYr, nonEnYr]);

  function generateData() {
    for (var i = 0; i < query2AData.length; i++) {
      enAvgRev.English.push(query2AData[i].AVGREVENUE);
      enYr.English.push(query2AData[i].YEAR);
    }

    for (var i = 0; i < query2BData.length; i++) {
      nonEnAvgRev.Other.push(query2BData[i].AVGREVENUE);
      nonEnYr.Other.push(query2BData[i].YEAR);
    }
  }

  const categories = enYr.English;
  const series = [
    {
      name: 'English',
      data: enAvgRev.English,
    },
    {
      name: 'Other',
      data: nonEnAvgRev.Other,
    },
  ];

  const ChartContainer = () => (
    <>
      <div className="row mb-3">
        <div className="k-card">
          <Chart
            pannable={{
              lock: 'y',
            }}
            zoomable={{
              mousewheel: {
                lock: 'y',
              },
              selection: {
                lock: 'y',
              },
            }}
            style={{
              height: 500,
              width: 600,
            }}
          >
            <ChartTitle text="Financial Success Based on Original Language" />
            <ChartLegend position="top" orientation="horizontal" />
            <ChartValueAxis>
              <ChartValueAxisItem
                title={{
                  text: 'Average Earnings',
                }}
              />
            </ChartValueAxis>

            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                title={{ text: 'Year' }}
                categories={categories}
                labels={{
                  rotation: 320}}   
              />
            </ChartCategoryAxis>
            <ChartSeries>
              {series.map((item, idx) => (
                <ChartSeriesItem
                  key={idx}
                  type="line"
                  style="smooth"
                  tooltip={{
                    visible: true,
                  }}
                  data={item.data}
                  name={item.name}
                />
              ))}
            </ChartSeries>
          </Chart>
        </div>
      </div>
    </>
  );

  function Render() {
    console.log("here");
    console.log(enAvgRev.English);
    return (
      <ChartContainer />
    );
  }

  console.log("true");
  console.log(enAvgRev.English);
  return (
    <Router>
      <div className="home">
        <div class="container">
          <div class="row align-items-start my-5">
            <div style={{display: "flex", flexDirection:"row"}}>
            <div class="col-lg-6">
              <ChartContainer />
            </div>
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
    </ Router >
  );
}

export default Query2;