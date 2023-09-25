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
  Navbar,
  Nav,
  NavItem,
  NavLink,
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
  DropdownItem,
  Media,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import cookie from "js-cookie";
import { Link } from "react-router-dom";

const Profile = () => {
  const [currentUser,setCurrentUser]=useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDay] = useState("");
  
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

   if (!accessToken || role !== "user"  && role !== "admin" && role !== "coach") {
     history.push("/auth/login"); // rediriger vers la page de login
   } else {
     const getCuurentuser = async () => {
       const response = await fetch(
         `http://localhost:5000/api/users/currentuser`
         // {
         //   headers: {
         //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
         //   },
       );
       const data = await response.json();
       if (role !== "user" && role !== "admin" && role !== "coach") {
        setCurrentUser(data);
       } else {
        setCurrentUser(data);
       }
     };
     getCuurentuser();
   }
 }, []);

  // const name = sessionStorage.getItem("name");
  const getCuurentuser = async ()=>{
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("accessToken");
    var config = {
      method: 'get',
      url: 'http://localhost:5000/api/users/currentuser',
      headers: { 
      
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      }
    }; 
    try{
      let ressul = axios(config)
      ressul.then(response=>setCurrentUser(response.data))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getCuurentuser()
  },[])
  console.log("my data usr",currentUser)

  // 

  const history = useHistory();
  const updateUser = async (userId, updatedUserData) => {
    try {
      const mytoken = await sessionStorage.getItem("accessToken");
      const jwtcookies = await sessionStorage.getItem("accessToken");
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${mytoken}`,
          Cookie: `jwt=${jwtcookies}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      };
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/update`,
        requestOptions
      );
      const data = await response.json();
      console.log(data); // log the response data to the console
    } catch (error) {
      console.log(error); // log any errors to the console
    }
  };
  
  const handleUpdateUser = (event) => {
    event.preventDefault();
    const updatedUserData = {
      name,
     
    };
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update user!'
    }).then((result) => {
      if (result.isConfirmed) {
        updateUser(currentUser._id, updatedUserData)
          .then((data) => {
            Swal.fire(
              'Updated!',
              'The user has been updated.',
              'success'
            ).then(() => {
              // perform any necessary actions after the user has been updated
            });
          })
          .catch((error) => {
            Swal.fire(
              'Error!',
              'An error occurred while updating the user.',
              'error'
            );
          });
      }
    });
  };
  

  /*const deleteUser = async (userId) => {
    try {
      const mytoken = await sessionStorage.getItem("accessToken");
      const jwtcookies = await sessionStorage.getItem("accessToken");
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mytoken}`,
          Cookie: `jwt=${jwtcookies}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
         `http://localhost:5000/api/users/${userId}/delete`,
        requestOptions
      );
      const data = await response.json();
      if (data.message === "User not found") {
        console.log("User not found.");
      } else {
        console.log(data); // log the response data to the console
      }
    } catch (error) {
      console.log(error); // log any errors to the console
    }
  };*/

  // seulement user delete son profil 
  const deleteUser = async (userId) => {
    try {
      const mytoken = await sessionStorage.getItem("accessToken");
      const jwtcookies = await sessionStorage.getItem("accessToken");
      const requestOptions = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mytoken}`,
          Cookie: `jwt=${jwtcookies}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/delete`,
        requestOptions
      );
      const data = await response.json();
      if (data.message === "User not found") {
        console.log("User not found.");
      } else {
        console.log(data); // log the response data to the console
      }
    } catch (error) {
      console.log(error); // log any errors to the console
    }
  };
  
  
  /*const handleDeleteUser = (event) => {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete user!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(currentUser._id)
          .then((data) => {
            Swal.fire(
              'Deleted!',
              'The user has been deleted.',
              'success'
            ).then(() => {
              history.push('/login');
            });
          })
          .catch((error) => {
            Swal.fire(
              'Error!',
              'An error occurred while deleting the user.',
              'error'
            );
          });
      }
    });
  };*/
  const handleDeleteUser = (event) => {
    event.preventDefault();
    const userRole = sessionStorage.getItem("role");
    if (userRole== "user" ) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete user!",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteUser(currentUser._id)
            .then((data) => {
              Swal.fire("Deleted!", "The user has been deleted.", "success").then(
                () => {
                  history.push("/login");
                }
              );
            })
            .catch((error) => {
              Swal.fire(
                "Error!",
                "An error occurred while deleting the user.",
                "error"
              );
            });
        }
      });
    } else {
      Swal.fire(
        "Error!",
        "You are not authorized to delete this user.",
        "error"
      );
    }
  };
  
 /* const deactivateUser = async (userId) => {
    try {
      let mytoken = await sessionStorage.getItem("accessToken");
      let jwtcookies = await sessionStorage.getItem("accessToken");
      const requestOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${mytoken}`,
          Cookie: `jwt=${jwtcookies}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ desactivate: true }),
      };
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/des`,
        requestOptions
      );
      const data = await response.json();
      if (data.message === "User already deactivated") {
        console.log("This user has already been deactivated.");
      } else {
        console.log(data); // log the response data to the console
        
      }
    } catch (error) {
      console.log(error); // log any errors to the console
    }
  };
  
  
  const handleDeactivateUser = (event) => {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate user!'
    }).then((result) => {
      if (result.isConfirmed) {
        deactivateUser(currentUser._id)
          .then((data) => {
            Swal.fire(
              'Deactivated!',
              'The user has been deactivated.',
              'success'
            ).then(() => {
              history.push('/login');
            });
          })
          .catch((error) => {
            Swal.fire(
              'Error!',
              'An error occurred while deactivating the user.',
              'error'
            );
          });
      }
    });
  };
  
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
*/

// seulement role user peut desactiver son profile 
const deactivateUser = async (userId) => {
  try {
    const mytoken = sessionStorage.getItem("accessToken");
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${mytoken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ desactivate: true }),
    };
    const response = await fetch(
      `http://localhost:5000/api/users/${userId}/des`,
      requestOptions
    );
    const data = await response.json();
    if (data.message === "User already deactivated") {
      console.log("This user has already been deactivated.");
    } else {
      console.log(data); // log the response data to the console
    }
  } catch (error) {
    console.log(error); // log any errors to the console
  }
};

const handleDeactivateUser = (event) => {
  event.preventDefault();
  const role = sessionStorage.getItem("role");
  if (role == "user" ) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate user!'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = sessionStorage.getItem("_id");
        deactivateUser(userId)
          .then((data) => {
            Swal.fire(
              'Deactivated!',
              'Your account has been deactivated.',
              'success'
            ).then(() => {
              handleLogout();
            });
          })
          .catch((error) => {
            Swal.fire(
              'Error!',
              'An error occurred while deactivating your account.',
              'error'
            );
          });
      }
    });
  } else {
    Swal.fire(
      'Error!',
      'You are not authorized to perform this action.',
      'error'
    );
  }
};
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

//hajer 
const createNewPost = async (event) => {
  event.preventDefault();
  var datatosen = {
    title: event.target.elements.title.value,
    message: event.target.elements.message.value,
    posterId: currentUser._id,
  };
  let mytoken = await sessionStorage.getItem("accessToken");
  let jwtcookies = await sessionStorage.getItem("accessToken");
  var config = {
    method: "post",
    url: "http://localhost:5000/api/post/",
    headers: {
      Authorization: `Bearer ${mytoken}`,
      Cookie: `jwt=${jwtcookies}`,
    },
    data: datatosen,
  };
  try {
    let ress = await axios(config);
    console.log(ress);
  } catch (error) {
    console.log(error);
  }
};

const [image, setImage] = useState("");
const handlerChangeImage = async (e) => {
  e.preventDefault();
  if (currentUser && image) {
    let datatosend = new FormData();
    datatosend.append("image", image[0]);
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");

    var config = {
      method: "put",
      url: `http://localhost:5000/api/users/${currentUser._id}/update`,
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
      data: datatosend,
    };
    try {
      let res = await axios(config);
      console.log("res", res);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("there is a prob");
  }
};

const [cv, setcv] = useState("");

const handlerUploadcv = async (e) => {
  e.preventDefault();
  if (currentUser && cv) {
    let datatosend = new FormData();
    datatosend.append("cv", cv[0]);
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("accessToken");

    var config = {
      method: "put",
      url: `http://localhost:5000/api/users/${currentUser._id}/uploadcv`,
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
      data: datatosend,
    };
    try {
      let res = await axios(config);
      console.log("res", res);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("there is a prob");
  }
};



  return (
    <>
     {role === "user" || role === "coach" ? (
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
              
               {/** <NavItem>
                    <NavLink href="/contact" onClick={handleLogout}>Logout</NavLink>
                </NavItem>*/} 
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
    </Navbar>
      ) : null}
     <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={`http://localhost:5000/${currentUser.image}`}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  {/* <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Connect
                  </Button> */}

                  {/* <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    
                  </Button> */}
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <Input
                    type="file"
                    color="info"
                    className="btn btn-default btn-sm mt-6"
                    onChange={(e) => setImage(e.target.files)}
                  />
                  <Input
                    type="submit"
                    onClick={(e) => handlerChangeImage(e)}
                    color="info"
                    className="btn btn-default btn-sm mt-1"
                    style={{ height: "30px" }}
                  />
                  {/* <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">22</span>
                        <span className="description">Friends</span>
                      </div>
                      <div>
                        <span className="heading">10</span>
                        <span className="description">Photos</span>
                      </div>
                      <div>
                        <span className="heading">89</span>
                        <span className="description">Comments</span>
                      </div>
                    </div>
                  </div> */}
                </Row>
                <div className="text-center">
                  <h3>
                    {currentUser.name}
                    <span className="font-weight-light"></span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {currentUser.email}
                  </div>

                  <hr className="my-4" />
                </div>
              </CardBody>
            </Card>
            {/* <Form className="card-profile shadow card" style={{padding:10}} onSubmit={(e)=>createNewPost(e)}>
              <FormGroup>
                <Label for="exampleEmail">Titre</Label>
                <Input
                  id="exampleEmail"
                  name="title"
                  type="title"
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleText">Message </Label>
                <Input id="exampleText" name="message" type="textarea" />
              </FormGroup>
              <Button type="submit"> Create Post </Button>
            </Form> */}
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
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
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={currentUser.name}
                            onChange={(e) => setName(e.target.value)}
                            id="input-username"
                            placeholder=" Username"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            defaultValue={currentUser.email}
                            placeholder=" Email"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-birthDate"
                            onChange={(e) => setBirthDay(e.target.value)}

                          >
                            birthDate
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={currentUser.birthDate}
                            id="input-birthDate"
                            placeholder="birthDate"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            role
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={currentUser.role}
                            id="input-role"
                            placeholder="role"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Specialite
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={currentUser.specialite}
                            id="input-address"
                            placeholder=" Specialite"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input- Gender"
                          >
                            Gender
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue={currentUser.gender}
                            id="input- Gender"
                            placeholder=" Gender"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup></FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup></FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      {currentUser &&
                      currentUser.role === "admin" ? null : currentUser.role ===
                        "coach" ? (
                        // eslint-disable-next-line react/jsx-no-comment-textnodes
                        <div>
                          <div>
                            {/* // eslint-disable-next-line react/jsx-no-target-blank, react/jsx-no-target-blank */}
                            <a
                              href={`http://localhost:5000/${currentUser.cv}`}
                              target="_blank"
                            >
                              Voir cv{" "}
                            </a>
                          </div>
                          pour changer le cv :<br></br>
                          <input
                            type="file"
                            name="cv"
                            onChange={(e) => setcv(e.target.files)}
                          />
                          <button onClick={(e) => handlerUploadcv(e)}>
                            upload cv
                          </button>
                        </div>
                      ) : null}
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="4"
                        defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                        Open Source."
                        type="textarea"
                      />
                    </FormGroup>
                    <Button color="danger" onClick={handleDeleteUser}>
                      Delete
                    </Button>
                    <Button color="warning" onClick={handleDeactivateUser}>
                      Deactivate
                    </Button>
                    <Button color="primary" onClick={handleUpdateUser}>
                      Update
                    </Button>
                    <Button color="success" href='/vieworder'>
                      My Orders
                    </Button>
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


export default Profile;
