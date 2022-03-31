import React from "react";
import logo from "../logo.svg";
import "../App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.response));
  }, []);

  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-5">
            <img
              src={logo} className="App-logo" alt="logo"
            />
            <h1 class="font-weight-light">{!data ? "Loading..." : data}</h1>
          </div>
          <div class="col-lg-7">
            <h1 class="font-weight-light">Home</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </div>

// {/* <div className="App">
// <header className="App-header">
//   <img src={logo} className="App-logo" alt="logo" />
//   <p>{!data ? "Loading..." : data}</p>
// </header>
// </div> */}
  );
}

export default App;
