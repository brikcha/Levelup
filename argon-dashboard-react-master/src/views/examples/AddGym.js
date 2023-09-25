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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// core components
import UserHeader from "components/Headers/UserHeader.js";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";

import React, { useState } from "react";
import axios from "axios";
import { Textarea } from "@mantine/core";
import { Howl } from 'howler';

const customStyle = {
  width: "300px",
  margin: "0 auto",
};

const AddGym = ({ history }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [fileData, setFileData] = useState({});

  const handleFileChange = (event) => {
    setFileData({
      ...fileData,
      [event.target.name]: event.target.files[0],
    });
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "name") {
      setName(value);
    } else if (name === "location") {
      setLocation(value);
    } else if (name === "capacity") {
      setCapacity(value);
    } else if (name === "phone") {
      setPhone(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // validate form fields
    if (!name || !location || !capacity || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^[0-9]+$/.test(capacity)) {
      toast.error("Capacity must be a number");
      return;
    }

    if (!/^[0-9]{8}$/.test(phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    } else {
      const formData = new FormData();

      formData.append("image", fileData.image);
      formData.append("video", fileData.video);
      formData.append("name", name);
      formData.append("location", location);
      formData.append("capacity", capacity);
      formData.append("phone", phone);
      formData.append("description", description);

      try {
        axios.post("http://localhost:5000/gym/addGym", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const sound = new Howl({
          src: [require('views/examples/video/tesoro_t3o23742.mp3')]
        });
        sound.play();
        history.push("/admin/gym");
      } catch (err) {
        console.error(err.response.data);
      }
    }
  };

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Gyms</h3>
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
                <Form onSubmit={handleSubmit} enctype="multipart/form-data">
                  <h6 className="heading-small text-muted mb-4">Add Gym</h6>
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
                            onChange={handleChange}
                            className="form-control-alternative"
                            defaultValue="lucky.jesse"
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
                            Capacity
                          </label>
                          <Input
                            name="capacity"
                            value={capacity}
                            onChange={handleChange}
                            className="form-control-alternative"
                            id="input-capacity"
                            placeholder="capacity"
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="location"
                          >
                            Location
                          </label>
                          <Input
                            name="location"
                            value={location}
                            onChange={handleChange}
                            className="form-control-alternative"
                            defaultValue="lucky.jesse"
                            id="location"
                            placeholder="Location"
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
                            Phone
                          </label>
                          <Input
                            name="phone"
                            value={phone}
                            onChange={handleChange}
                            className="form-control-alternative"
                            defaultValue="lucky.jesse"
                            id="input-phone"
                            placeholder="Phone"
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
                            onChange={handleChange}
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
                            htmlFor="input-image"
                          >
                            Image
                          </label>
                          <Input
                            class="form-control"
                            name="image"
                            type="file"
                            onChange={handleFileChange}
                            id="image"
                          ></Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-file"
                          >
                            Video
                          </label>
                          <Input
                            class="form-control"
                            name="video"
                            type="file"
                            onChange={handleFileChange}
                            id="video"
                          ></Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    xs{" "}
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <Button
                          color="primary"
                          type="submit"
                          size="large"
                          className="w-full"
                        >
                          Add Gym
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddGym;
