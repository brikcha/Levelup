import { Center } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { async } from "react-input-emoji";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,  
  Input,
  Form,
  Row,
  Col,
  Media,
} from "reactstrap";
import { textSpanIntersection } from "typescript";

const fnn = (el) => {
  var dassta = new Date(el);
  let x = dassta.toDateString();
  return x;
};

function ForumMore({ data, allusers }) {
  const [newData, setNewData] =useState(data) ;
  const [loading, setloading] = useState(false);
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
  const [refresh, setRefresh] = useState(false);
  const getcurretComment = async () => {
    try {
      let ress = await axios.get(
        `http://localhost:5000/api/post/${newData._id}`
      );
      console.log("ress", ress);
      setNewData(ress.data);
    } catch (error) {}
  };
  useEffect(() => {
    getCuurentuser();
  }, [refresh]);
  var vlike;
  var dlike;
  if (newData) {
    
    vlike = newData.likers.filter((el) => el.ifLike === true);
    dlike = newData.likers.filter((el) => el.ifLike === false);
  }

  const addCommentHandler = async (e) => {
    e.preventDefault();
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    if (
      /\b(?=\w)(asshole|fuck | shut up )\b(?!\w)/i.test(
        e.target.commentaire.value
      )
    ) {
      alert("theres a bad word");
    } else {
      var config = {
        method: "put",
        url: `http://localhost:5000/api/post/comments/${newData._id}`,

        data: {
          commenterId: currentUser._id,
          text: e.target.commentaire.value,
          commenterPseudo: currentUser.name,
        },
      };
      setloading(true);
      try {
        let ressul = await axios(config);
        getcurretComment();
        // window.location.reload(false);
        setRefresh(true);
        setloading(false);
        e.target.commentaire.value =""
      } catch (error) {
        console.log(error);
      }
    }
  };
  const addLikeHandler = async (e, vv) => {
    e.preventDefault();
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "put",
      url: `http://localhost:5000/api/post/likes/${newData._id}`,

      data: {
        likerId: currentUser._id,
        ifLike: vv,
      },
    };
    setloading(true);
    try {
      let ressul = await axios(config);

      //window.location.reload(false);
      setRefresh(true);
      setloading(false);

      //setchange(true)

    } catch (error) {
      console.log(error);
    }
  };

  const getuserImg = (ele) => {
    if (ele && allusers) {
      let resulFilter = allusers.filter((el) => el._id === ele);

      console.log("hey", resulFilter);
      if (resulFilter.length > 0) {
        return resulFilter[0].image;
      } else {
        return null;
      }
    }
  };
  const checkbadword = (e) => {
    console.log(e.target.value);
    if (/\b(?=\w)(asshole|fucking|shutup)\b(?!\w)/i.test(e.target.value)) {
      alert("Hey no bad words here!");
    }
  };

  var datePost = new Date(data.createdAt);
  let dd = datePost.toDateString();

  const chechCurrentuser = (ele) => {
    if (currentUser._id === ele) {
      return true;
    } else {
      return false;
    }
  };
  const [inputChange, setInputChange] = useState(false);
  const [textChange, setTextChange] = React.useState("hhh");

  const handlerUpdateComment = async (tes) => {
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "patch",
      url: `http://localhost:5000/api/post/editpost/${newData._id}`,
      headers: {
        Authorization: `Bearer ${mytoken}`,
        Cookie: `jwt=${jwtcookies}`,
      },
      data: {
        commentId: tes._id,
        text: textChange,
      },
    };
    try {
      let rs = await axios(config);

      console.log(rs);
    } catch (error) {
      console.log(error);
    }
  };
  const handlerDeleteComment = async (tes) => {
    console.log("ss", tes);
    let mytoken = await sessionStorage.getItem("accessToken");
    let jwtcookies = await sessionStorage.getItem("jwt");
    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `http://localhost:5000/api/post/deletecomment/${newData._id}`,
      headers: {
        // Authorization: `Bearer ${mytoken}`,
        // Cookie: `jwt=${jwtcookies}`,
        withCredentials: true,
      },
      data: {
        _id: tes,
      },
    };
    axios
      .request(config)
      .then((response) => {
        window.location.reload(false);
        // setRefresh(true);
        // setloading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card className="my-2" id="up">
      .
      <CardHeader style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>POST TITLE : {newData.title}</h4>

        <div>
          <Button onClick={(e) => addLikeHandler(e, true)}>
            Like {` (${vlike.length})`}
          </Button>
          <Button
            onClick={(e) => addLikeHandler(e, false)}
            color="danger"
          >{`dislike (${dlike.length})`}</Button>
        </div>
      </CardHeader>
      <CardBody className="d-flex flex-column align-items-center">
        <CardTitle tag="h5" style={{ textAlign: "center" }}>
          POST CONTENT <p>{dd}</p>
        </CardTitle>
        <CardText>
          <div>
            {newData.picture ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img
                src={`http://localhost:5000/uploads/${newData.picture}`}
                width={"150px"}
              />
            ) : (
              <span style={{ fontSize: 10, color: "gray" }}>
                there no picture
              </span>
            )}
          </div>

          <p>{newData.message}</p>
        </CardText>
      </CardBody>
      <div>
        {newData.comments.map((el, index) => {
          return (
            <Row key={index}>
              <Card
                body
                className="cardofforum"
                style={{ background: "#f4f3f3" }}
              >
                <CardTitle tag="h5">
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={`http://localhost:5000${getuserImg(
                          el.commenterId
                        )}`}
                      />
                    </span>
                  </Media>
                  {el.commenterPseudo}
                  <br />{" "}
                  <span style={{ fontSize: 10 }}>{fnn(el.timestamp)} </span>
                </CardTitle>
                <CardText style={{ marginLeft: 10 }}>{el.text} </CardText>
                {chechCurrentuser(el.commenterId) === true ? (
                  <div className="d-flex">
                    <Button
                      color="danger"
                      onClick={() => handlerDeleteComment(el._id)}
                    >
                      <i
                        className="ni ni-fat-remove"
                        style={{ fontSize: 23 }}
                      />
                    </Button>
                    <Button
                      color=""
                      onClick={() => setInputChange(!inputChange)}
                    >
                      <i className="ni ni-settings" style={{ fontSize: 23 }} />
                    </Button>
                  </div>
                ) : null}
                {inputChange ? (
                  <>
                    <Input
                      type="text"
                      defaultValue={el.tex}
                      onChange={(e) => setTextChange(e.target.value)}
                    />{" "}
                    <button onClick={() => handlerUpdateComment(el)}>
                      update
                    </button>
                  </>
                ) : null}
              </Card>
            </Row>
          );
        })}
      </div>
      <CardFooter>
        <Form onSubmit={(e) => addCommentHandler(e)}>
          <Input
            bsSize="m"
            className="mb-2"
            placeholder="my commennt"
            name="commentaire"
            required
            onChange={(e) => checkbadword(e)}
          />
          <Button type="submit"> Add Comment</Button>
        </Form>
      </CardFooter>
    </Card>
  );
}

export default ForumMore;
