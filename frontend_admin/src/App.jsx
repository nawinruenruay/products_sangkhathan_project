import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout/Layout";
import Home from "./Page/Home/Home";
import Product from "./Page/Product/Product";
import Activity from "./Page/Activity/Activity";
import Banner from "./Page/Banner/Banner";
import Order from "./Page/Order/Order";

import Test from "./Page/Test/Test.page";

import Login from "./Auth/Login";
import Logout from "./Auth/Logout";

import NotFound from "./Page/Notfound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/order" element={<Order />} />

          <Route path="/test" element={<Test />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
