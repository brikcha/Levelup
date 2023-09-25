
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  NavItem,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  Button,
  Spinner,
  Form,
  Label,
  Input,
  FormGroup,
  Media,
  NavLink,
} from "reactstrap";

import { useHistory } from "react-router-dom";
import ForumMore from "./ForumMore";
import "./style.css";
import { async } from "react-input-emoji";
import UserHeader from "components/Headers/UserHeader.js";
import cookie from "js-cookie";
import { Link } from "react-router-dom";

function Forum() {
    const history = useHistory();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modalfr, setModalfr] = useState(false);

  const togglefr = (idd) => setModalfr(!modalfr);

  const [DataToUpadet, setDataToUpadet] = useState({
    postid: "",
    title: "",
    message: "",
  });

  console.log("modalfr", DataToUpadet);
  const [requestReslt, setRequestResult] = useState(null);
  const [allPosts, setAllPosts] = useState(null);
  const [newCompo, setNewCpompo] = useState(false);
  const [elem, setelement] = useState([""]);
  const [listUsers, setListUsers] = useState([""]);

  const getallusers = async () => {
    var config = {
      method: "get",
      url: "http://localhost:5000/api/users/list/user",
    };
    try {
      var result = await axios(config);

      setListUsers(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getallPosts = async () => {
    var config = {
      method: "get",
      url: "http://localhost:5000/api/post/",
      headers: {
        "Content-Type": "application/json",
        Cookie:
          "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVzcHJpdC50biIsImlhdCI6MTY4MDY1MTI3MSwiZXhwIjoxNjgxMjU2MDcxfQ.HhKTZW8CTykNrIgeE6mWdBEb-0KZ-agGO-xtYZ7KjtU",
      },
    };
    try {
      var result = await axios(config);

      setAllPosts(result.data);
    } catch (error) {
      console.log(error);
    }
  };

   // block s user n' est pas connecte
   const [accessToken, setAccessToken] = useState("");
 
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
 
     if (!accessToken || role !== "user") {
       history.push("/auth/login"); // rediriger vers la page de login
     } else {
       const Forum = async () => {
         const response = await fetch(
           `http://localhost:5000/api/post/`
           // {
           //   headers: {
           //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
           //   },
         );
         const data = await response.json();
         if (role !== "user" ) {
          setelement(data);
         } else {
          setelement(data);
         }
       };
       Forum();
     }
   }, []);
 

  useEffect(() => {
    getallPosts();
    getallusers();
    //setChange(false);
  }, []);

  const handelSetNewComponent = (r) => {
    setNewCpompo(true);
    setelement(r);
    window.location.href = "#up";
  };

  useEffect(() => {}, [elem]);

  const findusername = (ele) => {
    if (ele && listUsers) {
      let resulFilter = listUsers.filter((el) => el._id === ele);

      if (resulFilter.length > 0) {
        return resulFilter[0].name;
      } else {
        return null;
      }
    }
  };

  const chechCurrentuser = (ele) => {
    if (currentUser._id === ele) {
      return true;
    } else {
      return false;
    }
  };

  const getuserImg = (ele) => {
    if (ele && listUsers) {
      let resulFilter = listUsers.filter((el) => el._id === ele);

      if (resulFilter.length > 0) {
        return resulFilter[0].image;
      } else {
        return null;
      }
    }
  };

  const [picture, setpicture] = useState("");

  const createNewPost = async (event) => {
    event.preventDefault();
    let datatosend = new FormData();

    datatosend.append("picture", picture[0]);
    datatosend.append("title", event.target.elements.title.value);
    datatosend.append("message", event.target.elements.message.value);
    datatosend.append("posterId", currentUser._id);

    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "post",
      url: "http://localhost:5000/api/post/",
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
      data: datatosend,
    };
    try {
      let ress = await axios(config);
      console.log(ress);
      setRequestResult(true);
      setModal(!modal);
    } catch (error) {
      console.log(error);
    }
  };
  const updatePost = async (event) => {
    event.preventDefault();
    const dataToUpadte = {
      title: event.target.elements.title.value,
      message: event.target.elements.message.value,
    };
    console.log("dataToUpadte", dataToUpadte);
    console.log("dataToUpadte", event.target.elements.idd.value);
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "put",
      url: `http://localhost:5000/api/post/${event.target.elements.idd.value}`,
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
      data: dataToUpadte,
    };
    try {
      let ress = await axios(config);
      console.log(ress);
      setRequestResult(true);
      setModal(!modal);
    } catch (error) {
      console.log(error);
    }
  };

  const name = sessionStorage.getItem("name");
  const [currentUser, setCurrentUser] = useState("");
  const getCuurentuser = async () => {
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "get",
      url: "http://localhost:5000/api/users/currentuser",
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
    };
    try {
      let ressul = axios(config);
      ressul.then((response) => setCurrentUser(response.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCuurentuser();
  }, []);

  const [recherche, setRecherche] = useState(null);

  var listpistfilter;
  if (allPosts && recherche) {
    let xx = allPosts.filter((el) =>
      el.message.toLowerCase().includes(recherche.toLowerCase())
    );
    listpistfilter = xx;
  }

  const ShowAlert = () => {
    setTimeout(() => {
      setRequestResult(false);
      window.location.reload(false);
    }, 2000);
    return (
      <Alert color="success">This is a success alert — check it out!</Alert>
    );
  };

  const handledeletePost = async (postid) => {
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "delete",
      url: `http://localhost:5000/api/post/${postid}`,
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
    };
    try {
      let rs = await axios(config);
      setRequestResult(true);
      console.log(rs);
    } catch (error) {
      console.log(error);
    }
  };
  const [userPostsShow, setUserPostsShow] = React.useState(false);

  if (allPosts && userPostsShow) {
    var userpostsfilter = allPosts.filter(
      (el) => el.posterId === currentUser._id
    );
  }

  const role = sessionStorage.getItem("role");
  const handleLogout = () => {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("_id");
    sessionStorage.removeItem("role");
  
    fetch("http://localhost:5000/auth/logout", {
      method: 'POST',
      credentials: 'include' ,
    })
    .then(response => {
      if (response.status === 204) {
        // The cookie did not exist
        console.log(response);
        console.log('Cookie not found');
      } else if (response.status === 200) {
        // The cookie was cleared successfully
        console.log('Cookie cleared');  
        cookie.remove("jwt", response.accessToken);
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
        window.location.href = "http://localhost:3000/auth/login"; 
      }
    })
    .catch(error => {
      console.error('Error while logging out:', error);
    });
  };
  //return
  
  if (currentUser.role !== "user") {
    console.log(currentUser, "role is not");

    return <h1>access denied for  {currentUser.role}</h1>;
    
  } else
    return (
      <>
      <Navbar
            className="navbar-horizontal navbar-dark bg-default"
            expand="lg"
      >
        <Container>
          <NavLink className="navbar-brand" href="/">
            LEVELUP
          </NavLink>
          <button
            aria-controls="navbar-info"
            aria-expanded={false}
            aria-label="Toggle navigation"
            className="navbar-toggler"
            data-target="#navbar-info"
            data-toggle="collapse"
            id="navbar-info"
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/acceuil">Home</NavLink>
            </NavItem>
            <NavItem>
         <NavLink href="/menu">Diet</NavLink>
       </NavItem>
            <NavItem>
              <NavLink href="/admin/user-profile">Profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/homeuser">Gyms</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/courslist">Cours</NavLink>
              </NavItem>
              <NavItem>
              <NavLink href="/calendar">Online Session</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/admin/forum">Forum</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/productlist">ESHOP</NavLink>
            </NavItem>
            
          </Nav>
          <UncontrolledDropdown nav>
                  <DropdownToggle className="pr-0" nav>
                    <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={`http://localhost:5000${currentUser.image}`}
                    />
                  </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold text-white" >
                          {name}
                        </span>

                      </Media>
                    </Media>
                  </DropdownToggle>
                  
                  <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">Welcome!</h6>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-single-02" />
                      <span>My profile</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-settings-gear-65" />
                      <span>Settings</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-calendar-grid-58" />
                      <span>Activity</span>
                    </DropdownItem>
                    <DropdownItem to="/admin/user-profile" tag={Link}>
                      <i className="ni ni-support-16" />
                      <span>Support</span>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem href="#pablo" onClick={handleLogout}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
        </Container>
      </Navbar><Container fluid>
          {requestReslt ? <ShowAlert /> : null}
          <Row style={{ margin: 20, background: "#c1c1c1" }}>
            {/* <h1>Forum</h1> */}

          </Row>
          <Row>
            <Button color="light" onClick={toggle}>
              Create a post
            </Button>
            <Button
              color="light"
              onClick={() => setUserPostsShow(!userPostsShow)}
            >
              {userPostsShow ? "see all " : "see my posts"}
            </Button>
          </Row>
          <Row>
            <div style={{ width: "100%" }}>
              <Input
                type="text"
                onChange={(e) => setRecherche(e.target.value)}
                style={{ width: "50%", margin: 50 }}
                placeholder="Recherche" />
            </div>

            <Col ClassName="" style={{ display: "flex", flexWrap: "wrap" }}>
              {userPostsShow ? (
                userpostsfilter.map((el, index) => { 
                  return (
                    <Card body key={index} className="cardofforum">
                      <CardTitle tag="h5">
                        <Media className="align-items-center">
                          <span className="avatar avatar-sm rounded-circle">
                            <img
                              alt="..."
                              src={`http://localhost:5000${getuserImg(
                                el.posterId
                              )}`} />
                          </span>
                          {findusername(el.posterId)}
                          <Media className="ml-2 d-none d-lg-block"></Media>
                        </Media>
                      </CardTitle>
                      {/* <CardText>{el.message}</CardText> */}
                      <p>comments:{el.comments.length}</p>{" "}
                      <p>reacts:{el.likers.length}</p>
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        {chechCurrentuser(el.posterId) === true ? (
                          <>
                            <Button
                              color="danger"
                              onClick={() => handledeletePost(el._id)}
                            >
                              <i
                                className="ni ni-fat-remove"
                                style={{ fontSize: 23 }} />
                            </Button>
                            <Button
                              color=""
                              onClick={() => {
                                togglefr();
                                setDataToUpadet({
                                  post: el._id,
                                  title: el.title,
                                  picture: el.picture,
                                  message: el.message
                                });
                              } }
                            >
                              <i
                                className="ni ni-settings"
                                style={{ fontSize: 23 }} />
                            </Button>
                          </>
                        ) : null}
                        <Button onClick={() => handelSetNewComponent(el)}>
                          See more
                        </Button>
                      </div>
                    </Card>
                  );
                })
              ) : !allPosts ? (
                <Spinner></Spinner>
              ) : listpistfilter && listpistfilter.length > 0 ? (
                listpistfilter.map((el, index) => {
                  return (
                    <Card body key={index} className="cardofforum">
                      <CardTitle tag="h5">
                        {el.title} {getuserImg(el.posterId)}
                        {findusername(el.posterId)}
                      </CardTitle>
                      {/* <CardText>{el.message}</CardText> */}
                      <p>comments:{el.comments.length}</p>{" "}
                      <p>reacts:{el.likers.length}</p>
                      <Button onClick={() => handelSetNewComponent(el)}>
                        See more
                      </Button>
                    </Card>
                  );
                })
              ) : (
                <>
                  {recherche && listpistfilter.length === 0 ? (
                    <p> empty result of search </p>
                  ) : (
                    ""
                  )}
                  {allPosts.map((el, index) => {
                    return (
                      <Card
                        body
                        key={index}
                        className="cardofforum"
                        style={{ flex: "none !important" }}
                      >
                        <CardTitle tag="h5">
                          {/* {el.title} {getuserImg(el.posterId)} */}

                          <Media className="align-items-center">
                            <span className="avatar avatar-sm rounded-circle">
                              <img
                                alt="..."
                                src={`http://localhost:5000${getuserImg(
                                  el.posterId
                                )}`} />
                            </span>
                            {findusername(el.posterId)}
                            <Media className="ml-2 d-none d-lg-block"></Media>
                          </Media>
                        </CardTitle>{" "}
                        <span className="mb-0 text-sm font-weight-bold">
                          {el.title}
                        </span>
                        <p>comments:{el.comments.length}</p>{" "}
                        <p>reacts:{el.likers.length}</p>
                        <div style={{ display: "flex", justifyContent: "end" }}>
                          {chechCurrentuser(el.posterId) === true ? (
                            <>
                              <Button
                                color="danger"
                                onClick={() => handledeletePost(el._id)}
                              >
                                <i
                                  className="ni ni-fat-remove"
                                  style={{ fontSize: 23 }} />
                              </Button>
                              <Button
                                color=""
                                onClick={() => {
                                  togglefr();
                                  setDataToUpadet({
                                    post: el._id,
                                    title: el.title,
                                    picture: el.picture,
                                    message: el.message
                                  });
                                } }
                              >
                                <i
                                  className="ni ni-settings"
                                  style={{ fontSize: 23 }} />
                              </Button>
                            </>
                          ) : null}
                          <Button onClick={() => handelSetNewComponent(el)}>
                            See more
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </>
              )}
            </Col>

            {newCompo ? (
              <Col>
                <ForumMore data={elem} allusers={listUsers}></ForumMore>
                <Button onClick={() => setNewCpompo(false)}>Hide comments</Button>
              </Col>
            ) : null}
          </Row>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Create new post</ModalHeader>
            <ModalBody>
              <Form
                className="card-profile shadow card"
                style={{ padding: 10, width: "100%" }}
                onSubmit={(e) => createNewPost(e)}
              >
                <FormGroup>
                  <Label for="exampleEmail">Titre</Label>
                  <Input id="exampleEmail" name="title" type="title" />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail2">image</Label>
                  <Input
                    id="exampleEmail2"
                    name="picture"
                    type="file"
                    onChange={(e) => setpicture(e.target.files)} />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleText">Message </Label>
                  <Input id="exampleText" name="message" type="textarea" />
                </FormGroup>
                <Button type="submit"> Create Post </Button>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          {/* MODAL 2 */}
          <Modal isOpen={modalfr} togglefr={togglefr}>
            <ModalHeader togglefr={togglefr}>update post</ModalHeader>
            <ModalBody>
              <Form
                className="card-profile shadow card"
                style={{ padding: 10, width: "100%" }}
                onSubmit={(e) => updatePost(e)}
              >
                <input
                  type="hidden"
                  name="idd"
                  defaultValue={DataToUpadet.post} />
                <FormGroup>
                  <Label for="exampleEmail">Titre</Label>
                  <Input
                    id="exampleEmail"
                    name="title"
                    type="title"
                    defaultValue={DataToUpadet.title} />
                </FormGroup>

                <FormGroup>
                  <Label for="exampleText">Message </Label>
                  <Input
                    id="exampleText"
                    name="message" 
                    type="textarea"
                    defaultValue={DataToUpadet.message} />
                </FormGroup>
                <Button type="submit"> update Post </Button>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={togglefr}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Container></>
    );
}

export default Forum;