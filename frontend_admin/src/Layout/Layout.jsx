import { AppShell, Flex, NavLink, ThemeIcon, Divider } from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, NavLink as Nl, useNavigate } from "react-router-dom";
import {
  IconActivity,
  IconShoppingCart,
  IconBrandProducthunt,
  IconBackground,
  IconDashboard,
} from "@tabler/icons-react";
import Header from "./Header/Header";
import TT from "../Api";
import axios from "axios";
// import { nprogress, NavigationProgress } from "@mantine/nprogress";
import Swal from "sweetalert2";

function Layout() {
  const [Active, setActive] = useState(() => {
    const Activenav = localStorage.getItem("Activenav");
    return Activenav ? parseInt(Activenav) : 0;
  });

  const nav = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  const data = [
    {
      title: "แดชบอร์ด",
      path: "/home",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconDashboard style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    "divider",
    {
      title: "จัดการสินค้า",
      path: "/product",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconBrandProducthunt style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    {
      title: "จัดการออเดอร์",
      path: "/order",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconShoppingCart style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    {
      title: "จัดการกิจกรรม",
      path: "/activity",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconActivity style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
    {
      title: "จัดการแบนเนอร์",
      path: "/banner",
      icon: (
        <ThemeIcon variant="light" color="dark" size={"md"}>
          <IconBackground style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      ),
    },
  ];

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      nav("/logout");
      return;
    }
    axios
      .post(TT + "Auth/verifyToken", { auth })
      .then((res) => {
        if (res.data.status === 200) {
          // console.log("Token ถูกต้อง");
        } else {
          // console.log("Token หมดอายุ");
          Swal.fire({
            icon: "error",
            title: "Token หมดอายุ",
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          nav("/logout");
        }
      })
      .catch((err) => {
        // console.error("Error:", err);
        nav("/logout");
      });
  }, []);

  const HandleNavClick = (path, index) => {
    setActive(index);
    localStorage.setItem("Activenav", index.toString());
    toggle();
    nav(path);
  };

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 270,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Flex direction={"column"}>
            {data.map((item, key) => {
              if (item === "divider") {
                return (
                  <Divider
                    key={key}
                    my="sm"
                    variant="dashed"
                    // label="เมนูหลัก"
                    // labelPosition="center"
                  />
                );
              } else {
                return (
                  <NavLink
                    key={key}
                    style={{
                      borderRadius: "10px",
                      fontWeight: "bold",
                      marginBottom: "5px",
                    }}
                    className="NavLink ripple"
                    onClick={() => HandleNavClick(item.path, key)}
                    active={key === Active}
                    component={Nl}
                    to={item.path}
                    label={item.title}
                    leftSection={item.icon}
                  />
                );
              }
            })}
            {/* {data.map((i, key) => (
              <NavLink
                key={key}
                style={{
                  borderRadius: "10px",
                  // padding: "15px 15px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
                className="NavLink ripple"
                onClick={() => HandleNavClick(i.path, key)}
                active={key === Active}
                component={Nl}
                to={i.path}
                label={i.title}
                leftSection={i.icon}
              />
            ))} */}
          </Flex>
        </AppShell.Navbar>
        <AppShell.Main
        // bg={"#f8f9fa"}
        // px={{ base: 5, sm: 0 }}
        // pl={{ base: 0, md: 295 }}
        >
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default Layout;
