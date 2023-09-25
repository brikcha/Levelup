import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { history } from "react-router-dom";
import { Redirect } from "react-router-dom";
import * as Components from "./components";
import cookie from "js-cookie";

import { Alert, Modal } from "react-bootstrap";

import { Button } from "reactstrap";
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
  integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
/>;

function App() {
  const [redirectTo, setRedirectTo] = useState("");
  const history = useHistory();
  const [error, setError] = useState(null);
  const [name, setname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [birthDate, setBirthDate] = React.useState("");
  const [cv, setCv] = React.useState("");
  const [specialite, setSpecialite] = React.useState("");
  const [role, setRole] = React.useState("");
  const [signIn, toggle] = React.useState(true);
  const [isCoach, setCoach] = React.useState(true); // set default value to true
  const [showAlert, setShowAlert] = useState(false); // Add missing state for showAlert
  const [alertVariant, setAlertVariant] = useState(""); // Add missing state for alertVariant
  const [alertMessage, setAlertMessage] = useState(""); // Add missing state for alertMessage

  const handleComboBoxChange = (event) => {
    if (event.target.value === "user") {
      setCoach(false);
      toggle(true);
    } else if (event.target.value === "coach") {
      setCoach(true);
      toggle(true);
    }
  };

  // disable the inputs by default
  const isDisabled = !isCoach;

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      name,
      password,
      email,
      gender,
      birthDate,
      cv,
      specialite,
      role,
    };

    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          setAlertVariant("success");
          setAlertMessage("User created successfully");
          setShowAlert(true);
          console.log("User created successfully");
          // TODO: handle success
        } else {
          setAlertVariant("danger");
          setAlertMessage("Failed to create user");
          setShowAlert(true);
          console.error("Failed to create user");
          // TODO: handle error
        }
      })
      .catch((error) => {
        console.error(error);
        // TODO: handle error
      });
  };

  const handleClose = () => setShowAlert(false);

  /* const handleLogin = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            localStorage.setItem("accessToken", data.accessToken);
           // refreshAccessToken();
            // handle successful login, e.g. store the access token in local storage
          })
          .catch((error) => {
            console.error("Error:", error);
            setError("Incorrect email or password");
          });
      };

    /* const refreshAccessToken = () => {
        fetch("http://localhost:5000/auth/refresh", {
          method: "GET",
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Store the new access token in local storage
            localStorage.setItem("accessToken", data.accessToken);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
*/

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        cookie.set("jwt", data.accessToken);
        sessionStorage.setItem("_id", data._id);
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("role", data.role);
        // Redirect to dashboard
        if (data.role === "user") {
          window.location.replace(`http://localhost:3000/acceuil`);
        }
       /* else if (data.role === "coach") {
          window.location.replace(`http://localhost:3000/acceuil`);
        }*/else{
        window.location.replace(`http://localhost:3000/admin/index`);
      }})
      .catch((error) => {
        console.error("Error:", error);
        setError("Incorrect email or password");
      });
  };

  const google = (data) => {
    cookie.set("jwt", data.accessToken);
    const newWindow = window.open("http://localhost:5000/auth/google", "_self");
    const checkWindowClosed = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(checkWindowClosed);
        window.location.replace("http://localhost:3000/acceuil");
      }
    }, 1000);
  };
  
  
  
  const github = (data) => {
    cookie.set("jwt", data.accessToken);
    window.open("http://localhost:5000/auth/github", "_self");
  };

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form onSubmit={handleSubmit}>
          <Modal show={showAlert} onHide={handleClose} centered>
            <Alert variant={alertVariant}>{alertMessage}</Alert>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal>

          <Components.Title>Create Account</Components.Title>

          <Components.Input
            type="name"
            placeholder="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Components.Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Components.Input
            type="gender"
            placeholder="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
          <Components.Input
            type="birthdate"
            placeholder="birthdate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />

          <Components.Input
            type="text"
            placeholder="Specialty"
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
            disabled={isDisabled}
            style={{ backgroundColor: isDisabled ? "lightgrey" : "#eee" }}
          />
          <Components.Input
            type="file"
            accept=".pdf,.doc,.docx"
            placeholder="CV"
            value={cv}
            onChange={(e) => setCv(e.target.value)}
            disabled={isDisabled}
            style={{ backgroundColor: isDisabled ? "lightgrey" : "#eee" }}
          />

          <Components.ComboBox
            placeholder="Select an option"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              handleComboBoxChange(e);
            }}
          >
            <option value="user">User</option>
            <option value="coach">Coach</option>
          </Components.ComboBox>

          <Components.Button>Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form onSubmit={handleLogin}>
          <div className="btn-wrapper text-center">
            <Button
              className="btn-neutral btn-icon"
              color="default"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <span className="btn-inner--icon">
                <img
                  alt="..."
                  src={
                    require("../../assets/img/icons/common/github.svg").default
                  }
                />
              </span>
              <span className="btn-inner--text" onClick={github}>
                Github
              </span>
            </Button>
            <Button
              className="btn-neutral btn-icon"
              color="default"
              onClick={ google} 
            >
              <span className="btn-inner--icon">
                <img
                  alt="..."
                  src={
                    require("../../assets/img/icons/common/google.svg").default
                  }
                />  
              </span>
              <span className="btn-inner--text"  >
                Google
              </span>
            </Button>
          </div>
          <br />
          <br />

          <Components.Title>Sign in</Components.Title>
          <Components.Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Components.Anchor href="#">Forgot your password?</Components.Anchor>
          <Components.Button>Sigin In</Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <img
              alt="..."
              src={
                require("../../assets/img/icons/common/Mobile login-bro.svg")
                  .default
              }
            />
            <Components.Paragraph>
              To keep connected with us please login with your personal info
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>

            <Components.Paragraph>
              Welcome to our plateform level up
            </Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Sigin Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}
export default App;
