import React, { useRef,useEffect, useState } from "react";
import {  useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Input,
  FormGroup,
  Row,
} from "reactstrap";

import axios from "axios";
import { motion } from "framer-motion";


const ListGymUser = ({  }) => {
  const [gyms, setGyms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState();
  const [unliked, setUnliked] = useState(false);
  
  // block s user n' est pas connecte
  const [accessToken, setAccessToken] = useState("");
  const history = useHistory();

  useEffect(() => {
    // Set access token and role in cookie
    document.cookie =
      "accessToken=" + sessionStorage.getItem("accessToken") + ";path=/";
    document.cookie = "role=" + sessionStorage.getItem("role") + ";path=/";
    // Retrieve access token and role from cookie
    const cookies = document.cookie.split(";");
    let accessToken, role;
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("accessToken=")) {
        accessToken = cookie.substring("accessToken=".length, cookie.length);
      } else if (cookie.startsWith("role=")) {
        role = cookie.substring("role=".length, cookie.length);
      }
    }

    if (!accessToken || role !== "user"  && role !== "coach") {
      history.push("/auth/login"); // rediriger vers la page de login
    } else {
      const ListGymUser = async () => {
        const response = await fetch(
          `http://localhost:5000/gym/getGyms`
          // {
          //   headers: {
          //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          //   },
        );
        const data = await response.json();
        if (role !== "user"  && role !== "coach") {
          setGyms(data);
        } else {
          setGyms(data);
        }
      };
      ListGymUser();
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/gym/getGyms")
      .then((response) => setGyms(response.data))
      .catch((error) => console.error(error));
  }, []);

  const likeGym = (id) => {
    axios
      .put(`http://localhost:5000/gym/like/${id}`, {
        userId: sessionStorage.getItem("_id"),
      })
      .then((response) => {
        setLiked(true);
        setUnliked(false);
        setLikeCount(response.data.likes.length);
        window.location.reload();
      });
  };
  const unlikeGym = (id) => {
    axios
      .put(`http://localhost:5000/gym/unlike/${id}`, {
        userId: sessionStorage.getItem("_id"),
      })
      .then((response) => {
        setLiked(false);
        setUnliked(true);
        setLikeCount(response.data.likes.length);
        window.location.reload();
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredGyms = gyms.filter((gym) =>
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

 
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Container className="mt-5" fluid>
      <Row className="justify-content-center">
        <Col md="12" lg="12" className="mb-3">
          <FormGroup>
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {" "}
        {filteredGyms.map((gym) => (
          <Col xs="12" sm="6" md="4" lg="3" className="mb-4" key={gym._id}>
           <Card
      className="shadow-sm h-100"
      style={{
        transform: isClicked ? "scale(1.1)" : "none",
        transition: "transform 0.3s ease-in-out",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        whileHover={{ rotate: isClicked ? 0 : -20, scale: isClicked ? 1 : 1.05 }}
        whileTap={{ rotate: isClicked ? 0 : 180, scale: isClicked ? 1 : 0.95 }}
        style={{
          width: "100%",
          height: "200px",
          position: "relative",
          borderRadius: "10px",
          overflow: "hidden",
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsClicked(!isClicked)}
      >
     <motion.img
  src={`http://localhost:5000/gym/uploads/${gym.image}`}
  alt="gym image"
  style={{
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: "10px",
    transformStyle: "preserve-3d",
    transform: "perspective(1000px)",
    backfaceVisibility: "hidden",
  }}
  whileTap={{
    rotate: 180,
    transition: { duration: 0.5 },
  }}
/>
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              transform: "translateZ(10px)",
              backfaceVisibility: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4 style={{ color: "#fff" }}>{gym.name}</h4>
          </div>
        )}
      </motion.div>
              <CardBody className="d-flex flex-column">
                <CardTitle tag="h5">Name: {gym.name}</CardTitle>
                <CardTitle tag="h5">Location: {gym.location}</CardTitle>
                <CardText>{gym.description}</CardText>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <i
                    className={`fas fa-heart me-2 ${
                      liked
                        ? "text-danger"
                        : gym.likes.includes(sessionStorage.getItem("_id"))
                        ? "text-danger"
                        : ""
                    }`}
                    onClick={() => {
                      if (!gym.likes.includes(sessionStorage.getItem("_id"))) {
                        likeGym(gym._id);
                        setLiked(true);
                      } else {
                        unlikeGym(gym._id);
                        setLiked(false);
                      }
                    }}
                  ></i>
                  <div>{gym.likes.length} Likes</div>
                  <i
                    className={`fas fa-thumbs-down me-2 ${
                      unliked
                        ? "text-orange"
                        : !gym.likes.includes(sessionStorage.getItem("_id"))
                        ? "text-orange"
                        : ""
                    }`}
                    onClick={() => {
                      if (gym.likes.includes(sessionStorage.getItem("_id"))) {
                        unlikeGym(gym._id);
                        setUnliked(true);
                      } else {
                        likeGym(gym._id);
                        setUnliked(false);
                      }
                    }}
                  ></i>{" "}
                </div>{" "}
                <br />
                <Row className="justify-content-center">
                  <a
                    href={`http://localhost:5000/gym/uploads/${gym.video}`}
                    className="text-blue"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Video
                  </a>
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};



export default ListGymUser; 
