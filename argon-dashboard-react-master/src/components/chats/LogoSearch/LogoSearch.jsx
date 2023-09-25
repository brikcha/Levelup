import React from "react";
import Logo from "../img/logo.png";
import "./LogoSearch.css";
import { UilSearch } from "@iconscout/react-unicons";
import {
  BsArrowBarLeft,
  BsArrowBarRight,
  BsArrowLeftCircle,
} from "react-icons/bs";
import { Link } from "react-router-dom";

const LogoSearch = () => {
  return (
    // <div className="LogoSearch">
    //   {/* <img src={Logo} alt="" /> */}
    //   <div className="Search">
    //     <input type="text" placeholder="#Explore" />
    //     <div className="s-icon">
    //       <UilSearch />
    //     </div>
    //   </div>
    // </div>
    <div className="LogoSearch p-4">
      <Link
        className=" items-center flex text-black font-extrabold"
        to={"/admin/user-profile"}
      >
        <BsArrowLeftCircle />
        <span className="p-2"> Return Profile</span>
      </Link>
    </div>
  );
};

export default LogoSearch;
