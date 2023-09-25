import React, { useState } from 'react';
import axios from 'axios';
import {  Button, Container, DropdownItem, DropdownMenu, NavItem, NavbarBrand, Row, UncontrolledCollapse, UncontrolledDropdown } from "reactstrap";
import {  Card, CardBody, CardTitle, Carousel, Col, Form, FormFeedback, FormGroup, Input, Label, Nav, Navbar, Table } from 'reactstrap';

import Footer from './Footer';
import { Link, NavLink } from 'react-router-dom';
import Navbars from './NavBars';


function Menu() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: '',
    num_meals: '',
    activity_level: ''
  });
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      const res = await axios.post('http://localhost:5000/products/run-script', formData);
      setResult(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  return (
    <>
  <Navbars></Navbars>
    <div className="App">
      <h1>BMI Calculator</h1>
      <Card>
  <CardBody>
    <CardTitle>Enter Your Information</CardTitle>
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="age">Age:</Label>
        <Input type="text" name="age" value={formData.age} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="height">Height (cm):</Label>
        <Input type="text" name="height" value={formData.height} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="weight">Weight (kg):</Label>
        <Input type="text" name="weight" value={formData.weight} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="gender">Gender:</Label>
        <Input type="select" name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="num_meals">Number of meals:</Label>
        <Input type="text" name="num_meals" value={formData.num_meals} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="activity_level">Activity level:</Label>
        <Input type="select" name="activity_level" value={formData.activity_level} onChange={handleChange}>
          <option value="1.2">Sedentary</option>
          <option value="1.375">Lightly active</option>
          <option value="1.55">Moderately active</option>
          <option value="1.725">Very active</option>
          <option value="1.9">Extra active</option>
        </Input>
      </FormGroup>
      <Button type="submit" color="primary">Calculate</Button>
    </Form>
  </CardBody>
</Card>

     {result && (
  <Table className="align-items-center table-flush" responsive>
    <thead className="thead-light">
      <tr>
        <th className="category-column">Category</th>
        <th className="details-column">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>BMI</td>
        <td>{result.data.BMI}</td>
      </tr>
      <tr>
        <td>Calorie Intake</td>
        <td>{result.data['Calorie Intake']}</td>
      </tr>
      <tr>
        <td>Sports Activity</td>
        <td>{result.data['Sports Activity']}</td>
      </tr>
      <tr>
        <td>Diet</td>
        <td>
          <ul className="list-unstyled diet-list">
            {Object.entries(result.data.Diet).map(([category, foods]) => (
              <li key={category}>
                <h5 className="diet-category">{category}</h5>
                <ul className="list-unstyled food-list">
                  {foods.map(([food, serving, calories]) => (
                    <li key={food} className="food-item">
                      {food} - {serving} - {calories} calories
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </td>
      </tr>
    </tbody>
  </Table>
)}


    </div>
    <Footer/>
    </>
  );
}

export default Menu;
