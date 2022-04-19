import React from "react";
import Axios from "axios";
import LineChart from "../LineChart";
// import { Line } from "react-chartjs-2";
import "../App.css";

function GenerateGraph(props) {  
  const [isLoading, setLoading] = React.useState(true);
  const [queryData, setQueryData] = React.useState([]);
  const [queryGraphData, setQueryGraphData] = React.useState([]);

  React.useEffect(() => {    
    // console.log(props.link)  
    Axios.get(props.link).then((response) => {
      // console.log("Hello", props.y)
      setQueryData(response.data);  
      // console.log(queryData)
      generateData();
      setLoading(false);    
    })
    .catch(error => {
      console.log(error)
    })
    //eslint-disable-next-line
  }, []);

  function generateData() {
    const chartData = [];    
    for (let i = 0; i < queryData.length; i++) {
      // console.log(props.y)
      let year = (queryData.at(i)[props.y]);
      let value = (queryData.at(i)[props.x]);
      chartData.push({
        label: year,
        value
        // tooltipContent: `<b>x: </b>${year}<br><b>y: </b>${value}`
      });
    // console.log(year)
    // console.log(value)
    }
    setQueryGraphData(chartData);
  }

  if (isLoading) {
    console.log('Loading');
    return <div className="App">Loading...</div>;
  }

  // console.log(queryGraphData)  
  return(
    <div>            
      <p>y</p>
      <div style = {{display: "flex", flexDirection: "row", maxWidth: "100%", marginLeft: 200}}>
        <LineChart style={{flex: 0.5}} data={queryGraphData} width={400} height={300}/>
        {/* <Line
       data={{
       // x-axis label values
       labels: year,
       datasets: [
          {
              label: "Something",
              // y-axis data plotting values
              data: value,
              fill: false,
              borderWidth:4,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor:'green',
              responsive:true
            },
          ],
        }}
      /> */}
        <div style={{flex: 0.5, marginLeft: 60, marginTop: 20}}>
          <h3>Considerations</h3>
          <p style={{height: 10}}>{props.body}</p>          
          <h3 style={{marginTop: 250}}>Application</h3>
        </div>          
      </div>            
      <p style={{marginLeft: 480}}>x-axis</p>      
    </div>    
  )
}

export default GenerateGraph