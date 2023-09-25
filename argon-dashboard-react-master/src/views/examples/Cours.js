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
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
  NavLink ,
  NavItem,
  Navbar,
  Nav
  

} from "reactstrap";
import Col from 'react-bootstrap/Col';

import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

// core components
import Header from "components/Headers/Header.js";
import React, { useState, useEffect } from "react";
import Editcours from "./Editcours";
import Swal from 'sweetalert2';
import SwipeableTemporaryDrawer from "./sidebar";
import cookie from "js-cookie";
import axios from "axios";

const Cours = () => { 
  const history = useHistory();

    const [cours, setCours] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    
    const deleteCours = async (coursId) => {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this cours!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it'
        });
    
        if (result.isConfirmed) {
          const response = await fetch(`http://localhost:5000/cours/delete/${coursId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log(data);
          // Update courss list
          const updatedCours = cours.filter(cours => cours._id !== coursId);
          setCours(updatedCours);
          Swal.fire('Deleted!', 'Your cours has been deleted.', 'success');
        }
      } catch (error) {
        console.error(error);
      }
    };
    
   
    useEffect(() => {
      // Set access token and role in cookie
      document.cookie = "accessToken=" + sessionStorage.getItem("accessToken") + ";path=/";
      document.cookie = "role=" + sessionStorage.getItem("role") + ";path=/";
      // Retrieve access token and role from cookie
      const cookies = document.cookie.split(';');
      let accessToken, role;
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("accessToken=")) {
          accessToken = cookie.substring("accessToken=".length, cookie.length);
        } else if (cookie.startsWith("role=")) {
          role = cookie.substring("role=".length, cookie.length);
        }
      }
    
      if (!accessToken || role !== "coach") {
        history.push("/auth/login"); // Rediriger vers la page de connexion
      } else {
        const fetchCours = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/cours/list`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            const data = response.data;
            if (role !== "coach") {
              setCours(data.filter((user) => user._id === sessionStorage.getItem("_id")));
            } else {
              setCours(data);
            }
          } catch (error) {
            console.log(error);
          }
        };
        fetchCours();
      }
    }, []);
    
    const handleLogout = () => {
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("_id");
      sessionStorage.removeItem("role");
  
      fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      })
        .then((response) => {
          if (response.status === 204) {
            // The cookie did not exist
            console.log(response);
            console.log("Cookie not found");
          } else if (response.status === 200) {
            // The cookie was cleared successfully
            console.log("Cookie cleared");
            cookie.remove("jwt", response.accessToken);
            document.cookie =
              "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie =
              "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
            window.location.href = "http://localhost:3000/auth/login";
          }
        })
        .catch((error) => {
          console.error("Error while logging out:", error);
        });
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
           {/** <NavItem>
             <NavLink href="/contact" onClick={handleLogout}>
                Logout
              </NavLink>
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
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid >
        {/* Table */}
        <Row>
          <div className="col">

            <Card className="shadow">
              <CardHeader className="border-0">
              <Container>
      <Row>
      <Col xs="8">
                    <h3 className="mb-0">List of Cours</h3>
                  </Col>
        <Col className="text-right" xs="4">
                    <Button color="secondary" href="" size="sm">
                      <a onClick={() => history.push("/admin/addcours")}>Add cours </a>
                    </Button>
                  </Col>
   
      </Row></Container>
             
              

              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Titre</th>
                    <th scope="col">Description</th>
                    <th scope="col">CoursHeure </th>
                    <th scope="col">Type</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {cours.map((cours) => (
                    <><tr key={cours._id}>
                    <th scope="row">
                      <Media className="align-items-center">
                        <a
                          className="avatar rounded-circle mr-3"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                           <img
                              alt={`${cours.name}`} 
                              
                              src={`http://localhost:5000${cours.image}`} 
                          />

                        </a>
                        
                        <Media>
                          <span className="mb-0 text-sm">
                            {cours.titre}
                          </span>
                        </Media>
                      </Media>
                      
                    </th>
                    <td>{cours.description}</td>
                    
                    <td>
                     {cours.CoursHeure}
                    </td>
                    <td>
                     {cours.type}
                    </td>
                    
                    <td className="text-right">
                      <UncontrolledDropdown>
                        
                          <Button
                          className="mr-4"
                          color="danger"
                          size="sm"
                            type="button" 
                            onClick={() => deleteCours(cours._id)}
                          >
                            Delete Cours
                          </Button>
                          <Button 
                          onClick={() => history.push(`/admin/editcours/${cours._id}`)}
                          className="mr-4"
                          color="info"
                          size="sm"
                          >
                         Update Cours
                         </Button>
                        
                
                      </UncontrolledDropdown>
                
                    </td>
                  </tr><tr>
                     
                     
                     
                    </tr></>
                ))}
                </tbody>
              </Table>
              
            </Card>
          </div>
        </Row>
      </Container>
     
    </>
  );
};

export default Cours;