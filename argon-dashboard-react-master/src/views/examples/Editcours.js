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

const Editcours=  ({ match, history })=> {

  const [titre, setTitre] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [cours, setCours] = useState([]);
  const [image, setImage] = useState('');
  const [rating, setRating] = useState('0');
  const [CoursHeure, setCoursHeure] = useState('');

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      history.push('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return;
    }
    fetch(`http://localhost:5000/cours/list/${match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitre(data.titre);
        setType(data.type);
        setDescription(data.description);
        setCoursHeure(data.CoursHeure);
        setRating(data.rating);
        setImage(data.image);
      })
      .catch((error) => console.error(error));
  }, [match.params.id, history]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    const role = sessionStorage.getItem('role');
    
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('CoursHeure', CoursHeure);
    formData.append('rating', rating);
    formData.append('image', image); // Ajouter l'image dans le FormData
    
    fetch(`http://localhost:5000/cours/update/${match.params.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
      body: formData, // Utiliser le FormData comme corps de la requête
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          history.push('/admin/cours');
          Swal.fire({
            icon: 'success',
            title: 'Cours  updated successfully!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          history.push("/admin/cours");
  
          Swal.fire({
            icon: 'success',
            title: 'Cours updated successfully!',
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
          text: 'An error occurred while updating the cours.',
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
                  <h6 className="heading-small text-muted mb-4">Update Cours</h6>
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
                            placeholder="Type"
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
                            name="coursheure"
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
      <Button variant="warning"   color="outline-warning" size="lg">
                       
                        
                          Update Cours
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

export default Editcours;