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
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Chat from "pages/Chat/Chat";
import AddGym from "views/examples/AddGym";
import HomeUser from "views/examples/HomeUser";
import GymDetail from "views/examples/GymDetail";

import { ToastContainer } from "react-toastify";
import Acceuil from "views/examples/Acceuil";
import App from "views/examples/App";
import ProductList from "views/examples/productList";
import ProductDetails from "views/examples/productDetail";
import CartItems from "views/examples/cart";
import Wishlist from "./views/examples/whishlist"
import viewOrder from "views/examples/viewOrder";
import ViewOrder from "views/examples/viewOrder";
import CoursList from "views/examples/coursList";
import CoursDetails from "views/examples/coursDetail";
import DailyCalendar from "views/examples/calendar";
import DailyCalendarcoach from "views/examples/calendarcoach";
import Online from "views/examples/online";
import Menu from "views/examples/algo";
//import EventCalendar from "views/examples/viewevent"

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <ToastContainer />
    <BrowserRouter>
      <Switch>
        <Route
          path="/
        "
          render={(props) => <AdminLayout {...props} />}
        />
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Route path="/chat" exact component={Chat} />
        <Route path="/homeuser" exact component={HomeUser} />
        <Route path="/videoGym/:id" exact component={GymDetail} />
        <Route path="/acceuil" exact component={Acceuil} />
        <Route path="/productlist" exact component={ProductList} />
        <Route path="/product/:id" exact component={ProductDetails} />
        <Route path="/cart" exact component={CartItems} />
        <Route path="/whishlist" exact component={Wishlist} />
        <Route path="/vieworder" exact component={ViewOrder} />
        <Route path="/courslist" exact component={CoursList} />
        <Route path="/cours/:id" exact component={CoursDetails} />
        <Route path="/calendar" exact component={DailyCalendar} />
        <Route path="/calendarcoach" exact component={DailyCalendarcoach} />
        <Route path="/online" exact component ={Online}/>
        <Route path="/menu" exact component={Menu} />

      {/**  <Route path="/viewevent" exact component={EventCalendar}/> */} 
        <Redirect from="/" to="/auth/login" />
      </Switch>
    </BrowserRouter>
  </>
);
