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
  const [query6Data, setQuery6Data] = React.useState([]);

    var dominance = {
        WarnerBros: [],
        ParamountPictures: [],
        UniversalPictures: [],
        Fox: [],
        ColumbiaPictures: []
    };
    var years = {
        WarnerBros: [],
        ParamountPictures: [],
        UniversalPictures: [],
        Fox: [],
        ColumbiaPictures: []
    };

    React.useEffect(() => {
        Axios.get('http://localhost:3001/productioncompanydominance/yearly').then((response) => {
            setQuery6Data(response.data);
        });
    }, []);

    React.useEffect(() => {
        generateData();
    }, [query6Data]);

    React.useEffect(() => {
        Render();
    }, [dominance, years]);

    function generateData() {
        for (var i = 0; i < query6Data.length; i++)
        {
            if (query6Data[i].PCNAME === " Warner Bros.") {
                dominance.WarnerBros.push(query6Data[i].RATINGPERCENTAGE);
                years.WarnerBros.push(query6Data[i].YEAR);
                console.log("lalalala");
                console.log(dominance.WarnerBros);
            }
            else if (query6Data[i].PCNAME === "Paramount Pictures") {
                dominance.ParamountPictures.push(query6Data[i].RATINGPERCENTAGE);
                years.ParamountPictures.push(query6Data[i].YEAR);
            }
            else if (query6Data[i].PCNAME === "Universal Pictures") {
                dominance.UniversalPictures.push(query6Data[i].RATINGPERCENTAGE);
                years.UniversalPictures.push(query6Data[i].YEAR);
            }
            else if (query6Data[i].PCNAME === "Twentieth Century Fox Film Corporation") {
                dominance.Fox.push(query6Data[i].RATINGPERCENTAGE);
                years.Fox.push(query6Data[i].YEAR);
            }
            else if (query6Data[i].PCNAME === "Columbia Pictures") {
                dominance.ColumbiaPictures.push(query6Data[i].RATINGPERCENTAGE);
                years.ColumbiaPictures.push(query6Data[i].YEAR);
            }
            console.log(query6Data[i].RATINGPERCENTAGE, query6Data[i].YEAR);
        }
    }

    const categories = years.WarnerBros;
    const series = [
        {
            name: 'Warner Bros',
            data: dominance.WarnerBros,
        },
        {
            name: 'Paramount Pictures',
            data: dominance.ParamountPictures,
        },
        {
            name: 'Universal Pictures',
            data: dominance.UniversalPictures,
        },
        {
            name: 'Twentieth Century Fox Film Corporation',
            data: dominance.Fox,
        },
        {
            name: 'Columbia Pictures',
            data: dominance.ColumbiaPictures,
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
                        <ChartTitle text="Production Company Dominance Over Time" />
                        <ChartLegend position="top" orientation="horizontal" />
                        <ChartValueAxis>
                            <ChartValueAxisItem
                                title={{
                                    text: 'Percentage of User Reviews',
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
        console.log(dominance.WarnerBros);
        return (
            <ChartContainer />
        );
    }
    
    console.log("true");
    console.log(dominance.WarnerBros);
  return (
    <Router>
      <div className="home">        
        <div class="container">
          <div class="row align-items-start my-5">
            <div class="col-lg-6">           
              <ChartContainer />             
              {/* <LineChart data={query3GraphData} width={400} height={300} /> */}
            </div>
            <div class="col-lg-6">
              <h1 class="font-weight-light">DOMINANCE OF PRODUCTION COMPANIES</h1>
              <dl>
                <dt>Considerations</dt>
                <div class="col-lg-auto">
                  <dd>- To avoid overcrowding of the graph and the presence of little-known production companies that have only produced a few movies, only the production companies with the top 5 most ratings for each year/month are considered.</dd>
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
                - Analyze the relative dominance of the top 5 production companies in terms of user engagement. <br /><br/>- The metric of user engagement for this graph is the amount of user ratings written for movies produced by the company. <br/><br/>- Interest may arise from an analysis of a production company’s reach and success, or be extended to economic standpoint to see how user engagement correlates to revenue

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