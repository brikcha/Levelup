import {
  Badge,
  Card,
  CardHeader,
  Table,
  Row,Input,
  UncontrolledTooltip,
  Toast
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import { useHistory, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Button,
  CardBody,
  FormGroup,
  Form,
  Container,
  Col,
} from "reactstrap";

import { withRouter } from 'react-router-dom';

//   const initialstate={
//     name:'',
//     price:'',
//     image:'',
//     description:'',
//     rating:'',

//   }

const Editprod=  ({ match, history })=> {

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState('0');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      history.push('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return;
    }
    fetch(`http://localhost:5000/products/list/${match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setRating(data.rating);
        setStock(data.stock);
        setCategory(data.category);
      })
      .catch((error) => console.error(error));
  }, [match.params.id, history]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    const role = sessionStorage.getItem('role');
    fetch(`http://localhost:5000/products/update/${match.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ name, description, price, rating,stock,category }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          history.push('/admin/icons');
          Swal.fire({
            icon: 'success',
            title: 'Product updated successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          history.push("/admin/icons");

          Swal.fire({

            icon: 'success',
            title: 'Product updated successfully!',
            showConfirmButton: false,
            timer: 1500,

          });
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the product.',
        });
      });
  };
    
      // 
    
     
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
                  <h6 className="heading-small text-muted mb-4">Update Product</h6>
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
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Category
                          </label>
                          <Input
                            name="Category"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)} 
                            className="form-control-alternative"
                            id="input-capacity"
                            placeholder="Category"
                            type="text"
                          />
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
                            placeholder="Location"
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
                            name="phone"
                            value={stock}
                            onChange={(event) => setStock(event.target.value)} 
                            className="form-control-alternative"
                            id="input-phone"
                            placeholder="Phone"
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
      <Button variant="warning"   color="outline-warning" size="lg">
                       
                        
                          Update Product
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

export default Editprod;