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
        for (var i = 0; i < query2AData.length; i++)
        {
            enAvgRev.English.push(query2AData[i].AVGREVENUE);
            enYr.English.push(query2AData[i].YEAR);
        }

        for (var i = 0; i < query2BData.length; i++)
        {
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
                            width: 800,
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
        <ChartContainer />
    );
}

export default Query2;