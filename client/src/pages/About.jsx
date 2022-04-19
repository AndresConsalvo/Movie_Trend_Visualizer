import React, { useEffect, useState } from "react";
import Popup from './Popup';
import Axios from 'axios';

function About() {
  const [tupleCount, setTupleCount] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    Axios.get('http://localhost:3001/tuplecount').then((response) => {
      setTupleCount(response.data);
    });
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="about">
      <div class="container">
        <div class="row align-items-start my-5">
          <div class="col-lg-6">
            <h1 class="font-weight-light">About this application</h1>
            <p>
              This movie trend visualizer seeks to manipulate stored movie data to model historical trends over time. 
              Although the trends are all formed from information related to movies, analysis of these trends can extend to 
              analysis of broader socioeconomic implications that are relevant today. In addition, information 
              extrapolated from these trends such as determining when certain movie categories tend to make the most money
              can lead itself to practical applications in industry.
            </p>
          </div>
          <div class="col-lg-6">
            <h1 class="font-weight-light">Data credits</h1>
            <p>
              Our movie dataset was sourced from <a href="https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset">Kaggle</a> in
               the form of csv files. <br></br>
              Rounak Banik, the author of the dataset on Kaggle, in turn collected his data from TMDB and GroupLens. Movie information 
              was obtained from the <a href="https://www.themoviedb.org/documentation/api?language=en-US">TMDB Open API</a>, 
              while movie ratings were sourced from the <a href="https://grouplens.org/datasets/movielens/latest/">Official GroupLens website</a>.
            </p>

          </div>
          <div class="col-lg-6">
            <input
              type="button"
              value="Count tuples"
              onClick={togglePopup}
            />
            {isOpen && <Popup
              content={<>
                <h4 class="font-weight-normal">Movie tuples: {tupleCount[0].NUMROWS}</h4>
                <h4 class="font-weight-normal">Member tuples: {tupleCount[1].NUMROWS}</h4>
                <h4 class="font-weight-normal">Cast member tuples: {tupleCount[2].NUMROWS}</h4>
                <h4 class="font-weight-normal">Production company tuples: {tupleCount[3].NUMROWS}</h4>
                <h4 class="font-weight-normal">Genre tuples: {tupleCount[4].NUMROWS}</h4>
                <h4 class="font-weight-normal">Movie rating tuples: {tupleCount[5].NUMROWS}</h4>
                <br></br>
                <h4>Total tuples: {tupleCount[6].NUMROWS}</h4>
              </>}
              handleClose={togglePopup}
            />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;