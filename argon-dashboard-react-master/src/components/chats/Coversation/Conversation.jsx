// export default Conversation;
import React, { useEffect, useState } from "react";
import {
  getPharmacies,
  getUser,
} from "../../../infrastructure/services/api/UserRequests";

function Conversation({ data, currentUserId, online }) {
  const [userData, setUserData] = useState(null);
  const name = sessionStorage.getItem("name");

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);
    //console.log(userId);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);

        setUserData(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    getUserData();
  }, []);
  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          <img
                                src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"

            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>
              {/*    */}

              {name}
            </span>
            <span style={{ color: "#51e200" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
}

export default Conversation;
