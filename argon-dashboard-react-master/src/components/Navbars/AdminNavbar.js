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
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import React from "react";
import axios from "axios";
import cookie from "js-cookie";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";
                       
const AdminNavbar = (props) => {
  const name = sessionStorage.getItem("name");
 //const email = sessionStorage.getItem("email");
  const [email, setEmail] = React.useState('');

  // Ajouter le code pour récupérer l'e-mail de l'utilisateur depuis le backend ici
  useEffect(() => {
    fetch('http://localhost:5000/auth/login/success')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setEmail(data.user.email);
        }
      })
      .catch(error => {
        console.error('Error while fetching user details:', error);
      });
  }, []);


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

const role = sessionStorage.getItem('role');

// hajer
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
        <>
        {role === 'admin' &&
          <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
            <Container fluid>
              <Link
                className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
                to="/"
              >
                {props.brandText}
              </Link>
              <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">

              </Form>
              <Nav className="align-items-center d-none d-md-flex" navbar>
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
                        <span className="mb-0 text-sm font-weight-bold">
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
              </Nav>
            </Container>
          </Navbar>
         }
          </>
    </>
  );
  };


export default AdminNavbar;
