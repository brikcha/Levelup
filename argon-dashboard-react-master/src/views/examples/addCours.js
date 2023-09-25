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
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

  // core components
  import Swal from "sweetalert2";

  import Header from "components/Headers/Header.js";
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import { Howl } from 'howler';


//   const initialstate={
//     name:'',
//     price:'',
//     image:'',
//     description:'',
//     rating:'',

//   }
  
function Add() {
  

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [CoursHeure, setCoursHeure] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const history = useHistory();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      history.push("/auth/login");
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const cours = {
      titre,
      description,
      type,
      CoursHeure,
      coach: sessionStorage.getItem("_id"),
      coachName:sessionStorage.getItem("name")
    };
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("CoursHeure", CoursHeure);

    formData.append("image", image);
    formData.append("cours", JSON.stringify(cours));
    formData.append("_id", cours.coach);
    formData.append("name",cours.coachName);

    const accessToken = sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");
    
  
    fetch(`http://localhost:5000/cours/add/${cours.coach}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: formData,
    })
    
      .then((response) => response.json())
      .then((data) => {
        setSuccessMessage("Cours created successfully!");
        setTitre("");
        setDescription("");
        setType("");
        setCoursHeure("");
        setImage("");
        history.push("/admin/cours");
        console.log(data);
        const sound = new Howl({
          src: [require('views/examples/video/tesoro_t3o23742.mp3')]
        });
        sound.play();
        alert("Event added successfully!");
      

        Swal.fire({
          icon: "success",
          title: "Cours added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Cours  could not be added!",
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
                    <h3 className="mb-0">Cours</h3>
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
                  <h6 className="heading-small text-muted mb-4">Add Cours</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Titre
                          </label>
                          <Input
                            name="titre"
                            value={titre}
                            onChange={(event) => setTitre(event.target.value)} 
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Titre"
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
                            Type
                          </label>
                          <Input
                            name="Type"
                            value={type}
                            onChange={(event) => setType(event.target.value)} 
                            className="form-control-alternative"
                            id="input-capacity"
                            placeholder="type"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                          
                          >
                            CoursHeure
                          </label>
                          <Input
                            name="CoursHeure"
                            value={CoursHeure}
                            onChange={(event) => setCoursHeure(event.target.value)} 
                            className="form-control-alternative"
                            placeholder="coursheure"
                            type="text"
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
                            Image
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
                       
                        
                          Add Cours
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