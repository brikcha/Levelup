
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
import {
  Badge,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Progress,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Howl } from 'howler';

const ListGyms = () => {
  const history = useHistory();
  const [gyms, setGyms] = useState([]);
  const MySwal = withReactContent(Swal);

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

    if (!accessToken || role !== "admin") {
      history.push("/auth/login"); // rediriger vers la page de login
    } else {
      const ListGyms = async () => {
        const response = await fetch(
          `http://localhost:5000/gym/listGym`
          // {
          //   headers: {
          //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          //   },
        );
        const data = await response.json();
        if (role !== "admin") {
          setGyms(data);
        } else {
          setGyms(data);
        }
      };
      ListGyms();
    }
  }, []);

  const deleteGym = (id) => {
    MySwal.fire({
      title: "Are you sure you want to delete this gym?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/gym/deleteGym/${id}`)
          .then((response) => {
            if (response.status === 200) {
              const sound = new Howl({
                src: [require('views/examples/video/fnfnotifica_ffacff33.mp3')]
              });
              sound.play();
              MySwal.fire({
                title: "Gym deleted successfully!",
                icon: "success",
                
              });
              setGyms(gyms.filter((gym) => gym._id !== id));
              window.location.reload();
              
            } else {
              MySwal.fire({
                title: "Error deleting gym.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            MySwal.fire({
              title: "Error deleting gym." + error,
              icon: "error",
            });
          });
      }
    });
  };

  useEffect(() => {
    axios

      .get("http://localhost:5000/gym/getGyms")

      .then((response) => setGyms(response.data))
      .catch((error) => console.error(error));
  }, []);

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
                    <h3 className="mb-0">List Gyms</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button color="secondary" href="" size="sm">
                      <a href="/admin/AddGym">Add Gym </a>
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className="align-items-center" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Location</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Description</th>
                      <th scope="col">Image</th>
                      <th scope="col">Edit</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(gyms) && gyms.map((gym) => (
                      <tr key={gym.id}>
                        <td>{gym.name}</td>
                        <td>{gym.location}</td>
                        <td>{gym.phone}</td>
                        <td>{gym.description}</td>
                        <td>
                          <img
                            src={`http://localhost:5000/gym/uploads/${gym.image}`}
                            alt="Uploaded Image"
                            style={{ width: "100px", height: "100px" }}
                          />
                        </td>
                        <td>
                          <a
                            href={`UpdateGym/${gym._id}`}
                            id={`updateGymLink/${gym.id}`}
                          >
                            <Button
                              className="mr-4"
                              color="info"
                              onClick={(e) => {
                                e.preventDefault();
                                const id = gym._id; // Get the gym ID from the `gym` object
                                alert(id);
                                window.location.href = `${e.currentTarget.parentElement.href}`; // Append the ID parameter to the URL
                              }}
                              size="sm"
                            >
                              Edit
                            </Button>
                          </a>
                        </td>
                        <td>
                          <Button
                            className="mr-4"
                            color="danger"
                            onClick={() => deleteGym(gym._id)}
                            size="sm"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ListGyms;