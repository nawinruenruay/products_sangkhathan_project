import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutUser } from "./layout/Layout";

// PAGEs
import { SplashscreenPage } from "./pages/SplashscreenPage/Splashscreen.page";
import { HomePage } from "./pages/HomePage/Home.page";
import { ProductPage } from "./pages/ProductPage/Product.page";
import { ProductDetailPage } from "./pages/ProductPage/ProductDetail.page";
import { AboutPage } from "./pages/AboutPage/About.page";
import { GalleryPage } from "./pages/GalleryPage/Gallery.page";
import { GalleryDetailPage } from "./pages/GalleryPage/GalleryDetail.page";
import { ContactPage } from "./pages/ContactPage/Contact.page";
import { UserPage } from "./pages/UserPage/User.page";
import { CartPage } from "./pages/CartPage/Cart.page";
import { CheckoutPage } from "./pages/CheckoutPage/Checkout.page";

// AUTH
import { Register } from "./auth/Register";
import { Login } from "./auth/Login";
import { Logout } from "./auth/Logout";

const router = createBrowserRouter([
  {
    element: <LayoutUser />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/product/:tabsValue",
        element: <ProductPage />,
      },
      {
        path: "/product/:v1/:v2",
        element: <ProductDetailPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
      },
      {
        path: "/gallery/:v1/:v2",
        element: <GalleryDetailPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout/:v",
        element: <CheckoutPage />,
      },
      {
        path: "/user/account/:tabsValue",
        element: <UserPage />,
      },
    ],
  },
  {
    path: "/",
    element: <SplashscreenPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
