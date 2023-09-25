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
  UncontrolledTooltip
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";


const Tables = () => {
    const [users, setUsers] = useState([]);
    const [coachs, setCoachs] = useState([]);
    const [accessToken, setAccessToken] = useState("");

    const history = useHistory();


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
    
      if (!accessToken || role !== "admin") {
        history.push("/auth/login"); // rediriger vers la page de login
      } else {
        const fetchUsers = async () => {
          const response = await fetch(`http://localhost:5000/api/users/list/user`, {
            headers: {
              "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
            }
          });
          const data = await response.json();
          if (role !== "admin") {
            setUsers(data.filter((user) => user._id === sessionStorage.getItem("_id")));
          } else {
            setUsers(data);
          }
        };
        fetchUsers();
      }
    }, []);
    

  // fetch coach 

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
  
    if (!accessToken || role !== "admin") {
      window.location.href = "http://localhost:3000/auth/login"; // Redirection vers la page de login
    }
  
    const fetchCoachs = async () => {
      const response = await fetch(`http://localhost:5000/api/users/list/coach`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (role !== "admin") {
        setCoachs(data.filter((user) => user._id === sessionStorage.getItem("_id")));
      } else {
        setCoachs(data);
      }
    };
    fetchCoachs();
  }, []);
  

 // methode bloc user en tant que admin
 const handleBanUser = async (e,id) => {
  e.preventDefault();
  let mytoken = await sessionStorage.getItem("accessToken");
  let jwtcookies = await sessionStorage.getItem("accessToken");
  console.log("myaceesstoken", mytoken);

  const config = {
    method: "put",
    url:  `http://localhost:5000/api/users/${id}/ban`,
    headers: {
      Authorization: `Bearer ${mytoken}`,
      Cookie: `jwt=${jwtcookies}`,
    },
  };
  try {
    
    const response =  await axios(config);
    // const updatedUsers = users.map((user) =>
    //   user._id === _id ? { ...user, isBanned: true } : user
    // );
    // setUsers(updatedUsers);
    console.log(response.data.message); // Log the response message
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

//delete user admin
const deleteUser = async (e, id) => {
  e.preventDefault();
  let mytoken = await sessionStorage.getItem("accessToken");
  let jwtcookies = await sessionStorage.getItem("jwt");
  console.log("myaceesstoken", mytoken);

  const config = {
    method: "DELETE",
    url: `http://localhost:5000/api/users/${id}/delete`,
    headers: {
      Authorization: `Bearer ${mytoken}`,
      Cookie: `jwt=${jwtcookies}`,
    },
  };

  try {
    const response = await axios(config);
    console.log(response.data.message); // Log the response message
    window.location.reload();
  } catch (error) {
    console.log(error.response.data.error); // Log the error message
  }
};

 
  
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">ListUser</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">birthDate</th>
                    <th scope="col">gender</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <><tr key={user._id}>
                    <th scope="row">
                      <Media className="align-items-center">
                       
                        <Media>
                          <span className="mb-0 text-sm">
                            {user.name}
                          </span>
                        </Media>
                      </Media>
                    </th>
                    <td>{user.email}</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />
                       {user.isActive ? <span style={{color: "green"}}>Active</span> : <span style={{color: "red"}}>Inactive</span>}
                      </Badge>
                    </td>
                    <td>
                     {user.birthDate}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">{user.gender}</span>
                        <div>
                         
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className="btn-icon-only text-light"
                          href="#pablo"
                          role="button"
                          size="sm"
                          color=""
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                          <DropdownItem
                            href="#pablo"
                            //onClick={deleteUser()}
                            onClick={(e) => deleteUser(e, user._id)}

                          >
                            Delete User
                          </DropdownItem>
                          <DropdownItem  
                            href="#pablo"
                            //onClick={handleBanUser()}
                            onClick={(e) => handleBanUser(e, user._id)}
                          >
                            Bloc User
                          </DropdownItem>
                          
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr><tr>
                     
                     
                     
                    </tr></>
                ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        {/* Dark table */}
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">ListCoach</h3>
              </CardHeader>
              <Table
                className="align-items-center table-dark table-flush"
                responsive
              >
                <thead className="thead-dark">
                  <tr>
                  <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">birthDate</th>
                    <th scope="col">gender</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {coachs.map((user) => (
                    <><tr key={user._id}>
                    <th scope="row">
                      <Media className="align-items-center">
                       
                        <Media>
                          <span className="mb-0 text-sm">
                            {user.name}
                          </span>
                        </Media>
                      </Media>
                    </th>
                    <td>{user.email}</td>
                    <td>
                      <Badge color="" className="badge-dot mr-4">
                        <i className="bg-warning" />
                       {user.isActive ? <span style={{color: "green"}}>Active</span> : <span style={{color: "red"}}>Inactive</span>}
                      </Badge>
                    </td>
                    <td>
                     {user.birthDate}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">{user.gender}</span>
                        <div>
                         
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          className="btn-icon-only text-light"
                          href="#pablo"
                          role="button"
                          size="sm"
                          color=""
                          onClick={(e) => e.preventDefault()}
                        >
                          <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        
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

export default Tables;

