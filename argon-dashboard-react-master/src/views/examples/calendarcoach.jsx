import React, { useEffect, useMemo } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Container, NavItem, NavLink , DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media} from "reactstrap";
import SwipeableTemporaryDrawer from "./sidebar";
import cookie from "js-cookie";
//import { Calendar } from "@mantine/dates";
import { Badge, Box, Indicator, Tooltip ,Button,Group} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import dayjs from "dayjs";
//import EventFormModal from "./EventFormModal";
import EventFormModal from "./addEvent";
import { DatePicker } from "@mantine/dates";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

function DailyCalendarcoach() {
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [event_date, setEventDate] = useState(new Date()); 
  const reminder_dates = [new Date()];
  const [showModal, setShowModal] = useState(false);
  const [parsedEventsDates, setParsedEventsDates] = useState(
    reminder_dates.map((date) => dayjs(date))
  );

 
  
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

  const handlegetEvents = async () => {
    let url = "http://localhost:5000/events/event_by_coach";

    await axios
      .post(url, { coachId: sessionStorage.getItem("_id") })
      .then((response) => setEvents(response.data.events));
  };
  useEffect(() => {
    handlegetEvents(); 
    const interval = setInterval(() => {
      handlegetEvents();
    }, 3500);
    return () => clearInterval(interval);
  }, []);


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
      const handlegetEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/events/event_by_coach`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          const data = response.data;
          if (role !== "coach") {
            setEvents(data.filter((user) => user._id === sessionStorage.getItem("_id")));
          } else {
            setEvents(data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      handlegetEvents();
    }
  }, []);
  
  
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
    <Box sx={{ height: "100%" }}>
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
              <SwipeableTemporaryDrawer />
            </NavItem>
            <NavItem>
              <NavLink href="/acceuil">Home</NavLink>
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
      </Navbar>
      <Box
        style={{ height: "100%", backgroundColor: "#DEE2E6", padding: "35px" }}
      >
        {events && (
          <DatePicker 
            fullWidth
            size="xl"
            value={event_date}
            onChange={(value) => {
              setEventDate(value);
              setShowModal(true);
            }}
            
            styles={(theme) => ({
              cell: {
                border: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
                }`,
              },
              day: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 0,
                height: 100,
                width:120,
                fontSize: theme.fontSizes.lg,
              },
              weekday: { fontSize: theme.fontSizes.lg },
              weekdayCell: {
                fontSize: theme.fontSizes.xl,
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[0],
                border: `1px solid ${
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
                }`,
                height: 70,
              },
            })}
            renderDay={(renderdate) => {
              const day = renderdate.getDate();
              const match = events.findIndex((item) =>
                dayjs(item.event_date).isSame(dayjs(renderdate), "day")
              );
              const details = events.find((reminder) =>
                dayjs(reminder.event_date).isSame(renderdate, "day")
              );

              if (match > -1 && details !== undefined) {
                return (
                  <>
                    <div>{day}</div>
                    <a href={details.onlinesession}>
                  <Badge variant="filled" color="green">
                   {details.title}
               </Badge>
               </a>
                    
                  </>
                );
              }
              return <div>{day}</div>;
            }}
          />
        )}

        {showModal && (
          <EventFormModal
            show={showModal}
            onHide={() => setShowModal(false)}
            event_date={event_date}
          />
        )}
      </Box>
    </Box>
  );
}

export default DailyCalendarcoach;

