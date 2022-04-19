import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap'
import { Offcanvas } from 'react-bootstrap'
import { color } from "d3";

function Navigation() {
  return (
    <div className="navigation">
      <Navbar bg="dark" expand={false}>        
        <Navbar.Brand href="#" style={{marginLeft: 10, color: "white"}}>MOVIE TREND VISUALIZER</Navbar.Brand>
        <Nav.Link href = "/" style={{marginLeft: 900}}>Home</Nav.Link>
        <Nav.Link href = "/about" style={{marginLeft: -80}}>About</Nav.Link>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"        
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Choose Query</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-2">
              {/* <Nav.Link href = "/query_1">Success rate of Movie vs. Language(English)</Nav.Link>               */}
              <Nav.Link href = "/query_2">Success rate of Movies Based on Original Language</Nav.Link>
              <Nav.Link href = "/">Profit Percentage vs. Time</Nav.Link>
              <Nav.Link href = "/query_4">Average amount of Male Over Time</Nav.Link>
              <Nav.Link href = "/query_5">Average amount of Female Over Time</Nav.Link>
              <Nav.Link href = "/query_6">Production Company Dominance Over Time</Nav.Link>
              {/* <Nav.Link href = "/query_7">Tracking Popularity of Genres Over Time</Nav.Link> */}
              <Nav.Link href = "/query_8">Genre Earnings Over Time</Nav.Link>
            </ Nav>
              {/* <Nav.Link href = {App}>Home</Nav.Link>
              <Nav.Link href = {About}>About</Nav.Link> */}
              {/* <NavDropdown title="Dropdown" id="offcanvasNavbarDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown> */}                      
            {/* <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form> */}
          </Offcanvas.Body>
        </Navbar.Offcanvas>        
      </Navbar>
      {/* <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Movie Trend Visualizer
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav> */}
    </div>
  );
}

export default Navigation;