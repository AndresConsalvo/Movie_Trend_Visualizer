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
} from "@progress/kendo-react-charts";
import "@progress/kendo-theme-default/dist/all.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function Query_1() {
  const [isLoading, setLoading] = React.useState(true);
  const [query8Data, setQuery8Data] = React.useState([]);
  const [query8GraphData, setQuery8GraphData] = React.useState([]);

  var genres = {
    Action: [],
    Drama: [],
    Thriller: [],
    Comedy: [],
  };

  var years = {
    Action: [],
    Drama: [],
    Thriller: [],
    Comedy: [],
  };
  React.useEffect(() => {
    Axios.get("http://localhost:3001/genreEARNINGS/yearly").then((response) => {
      console.log(response.data);
      setQuery8Data(response.data);
    });
  }, []);

  React.useEffect(() => {
    generateData();
    // setLoading(false);
  }, [query8Data]);

  React.useEffect(() => {
    Render();
  }, [genres, years]);

  function generateData() {
    // const chartData = [];
    // for (let i = 0; i < query8Data.length; i++) {
    //   let year = query8Data.at(i).YEAR;
    //   let value = query8Data.at(i)["EARNINGS"];

    //   chartData.push({
    //     label: year,
    //     value,
    //     tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${value}`
    //   });
    // }
    // setQuery8GraphData(chartData);
    for (var i = 0; i < query8Data.length; i++) {
      if (query8Data[i].GENRENAME === " Drama") {
        genres.Drama.push(query8Data[i].EARNINGS);
        years.Drama.push(query8Data[i].YEAR);
        console.log("lalalala");
        console.log(genres.Drama);
      } else if (query8Data[i].GENRENAME === " Comedy") {
        genres.Comedy.push(query8Data[i].EARNINGS);
        years.Comedy.push(query8Data[i].YEAR);
      } else if (query8Data[i].GENRENAME === " Thriller") {
        genres.Thriller.push(query8Data[i].EARNINGS);
        years.Thriller.push(query8Data[i].YEAR);
      } else if (query8Data[i].GENRENAME === " Action") {
        genres.Action.push(query8Data[i].EARNINGS);
        years.Action.push(query8Data[i].YEAR);
      }
      console.log(query8Data[i].EARNINGS, query8Data[i].YEAR);
    }
  }

  const categories = years.Action;
  const series = [
    {
      name: "Action",
      data: genres.Action,
    },
    {
      name: "Thriller",
      data: genres.Thriller,
    },
    {
      name: "Comedy",
      data: genres.Comedy,
    },
    {
      name: "Drama",
      data: genres.Drama,
    },
  ];

  const ChartContainer = () => (
    <>
      <div className="row mb-3">
        <div className="k-card">
          <Chart
            pannable={{
              lock: "y",
            }}
            zoomable={{
              mousewheel: {
                lock: "y",
              },
              selection: {
                lock: "y",
              },
            }}
            style={{
              height: 500,
              width: 600,
            }}
          >
            <ChartTitle text="Genre Earnings Over Time" />
            <ChartLegend position="top" orientation="horizontal" />
            <ChartValueAxis>
              <ChartValueAxisItem
                title={{
                  text: "Earnings by Genre",
                }}
              />
            </ChartValueAxis>

            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                title={{ text: "Year" }}
                categories={categories}
                labels={{
                  rotation: 320,
                }}
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
    console.log(genres.Action);
    return <ChartContainer />;
  }

  console.log("true");
  console.log(genres.Action);

  return (
    <Router>
      <div className="home">
        <div class="container">
          <div class="row align-items-start my-5">
            <div class="col-lg-6">
              {/* <LineChart data={query8GraphData} width={400} height={300} /> */}
              <h3 style={{ marginLeft: 100, marginBottom: 30 }}>
                Popularity of Genres (In terms of revenue) vs. Time
              </h3>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p style={{ marginTop: 150, transform: [{ rotate: "90deg" }] }}>
                  Revenue of Genres
                </p>
                <LineChart data={query8GraphData} width={400} height={300} />
              </div>
              <p style={{ marginLeft: 350, marginTop: 20 }}>Time</p>
            </div>
            <div class="col-lg-6">
              <h1 class="font-weight-light">EARNINGS PER GENRE</h1>
              <dl>
                <dt>
                  <br />
                  <br />
                  Considerations:
                </dt>
                <div class="col-lg-auto">
                  <dd>
                    - Movies without revenue information are excluded, as we
                    have no way to map the EARNINGS for the Y axis.
                    <br />
                    <br />
                    <br />
                  </dd>
                  {/* <dd>
                    - Our movie data source wasn't perfect, as some movies had millions of dollars in budget but less than one hundred in revenue.
                    Consequently, outliers (identified by being located outside of 1.5 times the IQR) were removed.
                  </dd>
                  <dd>
                    - Prior to 1998, many of the years only had a few movies that provided movie financial information.
                    Thus, these years were not considered because basing a year's performance on three movies would not yield reliable results.
                  </dd> */}
                </div>
                <dt>Applications</dt>
                <dd>
                  - From an economic standpoint, it can be useful to check how
                  the success of genres changes seasonally as well as over the
                  years.
                </dd>
                <dd>
                  - Seeing when a genre tends to earn more can help with timing
                  movie releases.
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );

  // function generateCategories() {
  //   for (var i = 0; i < query8Data.length; i++) {
  //     if (query8Data[i].GENRENAME === " Drama") {
  //       genres.Drama.push(query8Data[i].EARNINGS);
  //       years.Drama.push(query8Data[i].YEAR);
  //       console.log("lalalala");
  //       console.log(genres.Drama);
  //     }
  //     else if (query8Data[i].GENRENAME === " Comedy") {
  //         genres.Comedy.push(query8Data[i].EARNINGS);
  //         years.Comedy.push(query8Data[i].YEAR);
  //     }
  //     else if (query8Data[i].GENRENAME === " Thriller") {
  //         genres.Thriller.push(query8Data[i].EARNINGS);
  //         years.Thriller.push(query8Data[i].YEAR);
  //     }
  //     else if (query8Data[i].GENRENAME === " Action") {
  //         genres.Action.push(query8Data[i].EARNINGS);
  //         years.Action.push(query8Data[i].YEAR);
  //     }
  //     console.log(query8Data[i].EARNINGS, query8Data[i].YEAR);
  //   }
  // }

  // if (isLoading) {
  //   console.log("Loading");
  //   return <div className="Query_1">Loading...</div>;
  // }

  // // pass the height, width, and data as props to <LineChart />
  // // data object contains label (X-Axis) and value (Y-Axis) as well as the tooltipContent we want to show hovering over the chart
  // console.log("render");
  // return (
    // <Router>
    //   <div className="home">
    //     <div class="container">
    //       <div class="row align-items-start my-5">
    //         <div class="col-lg-6">
    //           {/* <LineChart data={query8GraphData} width={400} height={300} /> */}
    //           <h3 style={{ marginLeft: 100, marginBottom: 30 }}>
    //             Popularity of Genres (In terms of revenue) vs. Time
    //           </h3>
    //           <div style={{ display: "flex", flexDirection: "row" }}>
    //             <p style={{ marginTop: 150, transform: [{ rotate: "90deg" }] }}>
    //               Revenue of Genres
    //             </p>
    //             <LineChart data={query8GraphData} width={400} height={300} />
    //           </div>
    //           <p style={{ marginLeft: 350, marginTop: 20 }}>Time</p>
    //         </div>
    //         <div class="col-lg-6">
    //           <h1 class="font-weight-light">EARNINGS PER GENRE</h1>
    //           <dl>
    //             <dt>
    //               <br />
    //               <br />
    //               Considerations:
    //             </dt>
    //             <div class="col-lg-auto">
    //               <dd>
    //                 - Movies without revenue information are excluded, as we
    //                 have no way to map the EARNINGS for the Y axis.
    //                 <br />
    //                 <br />
    //                 <br />
    //               </dd>
    //               {/* <dd>
    //                 - Our movie data source wasn't perfect, as some movies had millions of dollars in budget but less than one hundred in revenue.
    //                 Consequently, outliers (identified by being located outside of 1.5 times the IQR) were removed.
    //               </dd>
    //               <dd>
    //                 - Prior to 1998, many of the years only had a few movies that provided movie financial information.
    //                 Thus, these years were not considered because basing a year's performance on three movies would not yield reliable results.
    //               </dd> */}
    //             </div>
    //             <dt>Applications</dt>
    //             <dd>
    //               - From an economic standpoint, it can be useful to check how
    //               the success of genres changes seasonally as well as over the
    //               years.
    //             </dd>
    //             <dd>
    //               - Seeing when a genre tends to earn more can help with timing
    //               movie releases.
    //             </dd>
    //           </dl>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </Router>
  // );
}

export default Query_1;
