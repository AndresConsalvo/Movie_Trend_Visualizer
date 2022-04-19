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
        <div class="row align-items-center my-5">
          <div class="col-lg-6">
            <h1 class="font-weight-light">About</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div class="col-lg-6">
            <h1 class="font-weight-light">Contact</h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
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