import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media
} from "reactstrap";
import ListGymUser from "./ListGymUser";
import cookie from "js-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function HomeUser() {
  

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
                        <span className="mb-0 text-sm font-weight-bold text-white">
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
      <div className="header bg-white py-7 py-lg-8">
        <Container>
          <div className="header-body text-center mb-7">
            <Row className="justify-content-center">
              <Col lg="5" md="6">
                <h1 className="text-black">List GYMS</h1>
                <p className="text-lead text-gray-500"></p>
                {/* <NavLink className="btn btn-success mt-4" href="#!">
                  Learn more
                </NavLink> */}
              </Col>
            </Row>
          </div>
        </Container>
        <div className="separator separator-bottom separator-skew zindex-100"></div>
      </div>
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <ListGymUser />
        </Row>
      </Container>
      <CardFooter className="footer">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavItem>
                  <NavLink href="/" target="_blank">
                    My Website
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/admin/user-profile" target="_blank">
                    Profile
                  </NavLink>
                  <NavLink href="/homeuser" target="_blank">
                    Gyms
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/admin/forum" target="_blank">
                    Forum
                  </NavLink>
                </NavItem>
                <NavItem>
              <NavLink href="/productlist">ESHOP</NavLink>
              </NavItem>
                <NavItem>
                      <NavLink href="/" onClick={handleLogout}>Logout</NavLink>
                  </NavItem>
              </Nav>
            </Col>
          </Row>
        </Container>
      </CardFooter>
    </>
  );
}
