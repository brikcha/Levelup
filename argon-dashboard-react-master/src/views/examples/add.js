/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import Form from 'react-bootstrap/Form';

  // core components
  import Swal from "sweetalert2";

  import Header from "components/Headers/Header.js";
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
import { Select } from "@mui/material";

//   const initialstate={
//     name:'',
//     price:'',
//     image:'',
//     description:'',
//     rating:'',

//   }
  
function Add() {
  

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [stock, setStock] = useState(0);

  const history = useHistory();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      history.push("/auth/login");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const product = {
      name,
      description,
      price,
      stock,
      category,
    };
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("image", image);
    formData.append("product", JSON.stringify(product));

    const accessToken = sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");
    
  
    fetch("http://localhost:5000/products/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: formData,
    })
    
      .then((response) => response.json())
      .then((data) => {
        setSuccessMessage("Product created successfully!");
        setName("");
        setDescription("");
        setPrice(0);
        setStock(0);
        setCategory('');
        setImage("");
        history.push("/admin/icons");
        console.log(data);

        Swal.fire({
          icon: "success",
          title: "Product added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Product could not be added!",
        });
      });
  };
  
  
    return (
      
      <>
              <Header />
        <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Products</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Settings
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <h6 className="heading-small text-muted mb-4">Add Product</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Name
                          </label>
                          <Input
                            name="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)} 
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                        <Form.Label htmlFor="disabledSelect">Category</Form.Label>
          <Form.Select
                     
    name="Category"
    value={category}
    onChange={(event) => setCategory(event.target.value)}
    className="form-control-alternative"
    id="input-capacity"
    placeholder="Category"
    type="text"
    style={{ fontSize: '1rem', height: '3rem', paddingLeft: '1rem', width:'20rem', paddingRight: '1rem' }}
                         // add custom styles here
>

                             <option value="all">All categories</option>
        <option value="proteines">Proteines</option>
        <option value="weights">Weights</option>
        <option value="dietary supplement">Dietary supplement</option>
        <option value="machines">Machines</option>
        <option value="sport">Sport</option>

                        </Form.Select>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="location"
                          >
                            Price
                          </label>
                          <Input
                            name="price"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)} 
                            className="form-control-alternative"
                            defaultValue="lucky.jesse"
                            id="location"
                            placeholder="price"
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone"
                          >
                            stock
                          </label>
                          <Input
                            name="stock"
                            value={stock}
                            onChange={(event) => setStock(event.target.value)} 
                            className="form-control-alternative"
                            id="input-phone"
                            placeholder="stock"
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone"
                          >
                            Description
                          </label>
                          <textarea
                            class="form-control"
                            rows="3"
                            name="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)} 
                            id="input-description"
                            placeholder="Description"
                          ></textarea>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone"
                          >
                            Description
                          </label>
                          <Input
                            class="form-control"
                            rows="3"
                            type="file"
                            name="image"
                            onChange={(event) => setImage(event.target.files[0])}

                            id="input-description"
                            placeholder="image"
                          ></Input>
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <div className="pl-lg-4">
                    <Row>
                    <div className="d-grid gap-2">
      <Button variant="primary"   color="outline-success" size="lg">
                       
                        
                          Add Product
                        </Button>
                      </div>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
        {/* Page content */}
       
      </>
    );
  };
  
  export default Add;