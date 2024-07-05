import {
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Image,
  useMantineColorScheme,
  useComputedColorScheme,
  Tooltip,
  ActionIcon,
  NavLink,
  Flex,
  Text,
  Menu,
  UnstyledButton,
  Indicator,
  Avatar,
} from "@mantine/core";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMoon,
  IconSun,
  IconChevronUp,
  IconLogout,
  IconChevronDown,
  IconUserCircle,
  IconShoppingCart,
  IconCashRegister,
} from "@tabler/icons-react";
import { NavLink as Nl, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import data from "./data";
import classes from "./Header.module.css";
import logo from "../../../assets/icon/LOGO.png";
import { useCartsum } from "../../../components/CartContext";
import { Api } from "../../../Api";

interface MenuItem {
  title: string;
  path: string;
  sub?: MenuItem[];
  icon?: React.ReactNode;
}

function Header() {
  const { cartsum, fetchCartsum } = useCartsum();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const { id, role } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const location = useLocation();
  const nav = useNavigate();
  const [activePath, setActivePath] = useState<string>(location.pathname);
  const [Data, setData] = useState([]);
  // const [LoadingData, setLoadingData] = useState(false);

  const FetchData = () => {
    // setLoadingData(true);
    axios
      .post(Api + "/User/Showuser", {
        userid: atob(id),
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.length !== 0) {
          // setData(data);
        }
        // setLoadingData(false);
      });
  };

  // FUCK OFF
  const Link = (item: MenuItem[], path: string = ""): JSX.Element[] => {
    return item.map((i, key) => {
      const fullPath = path ? `${path}${i.path}` : i.path;
      return (
        <NavLink
          key={key}
          onClick={() => HandleNavClick(fullPath)}
          active={fullPath === activePath}
          component={Nl}
          to={fullPath}
          label={i.title}
          className={classes.link}
        />
      );
    });
  };

  const HandleNavClick = (path: string) => {
    setActivePath(path);
    closeDrawer();
  };

  const UserPage = () => {
    nav("/user/profile");
    closeDrawer();
  };

  const Logout = () => {
    nav("/logout");
  };

  useEffect(() => {
    if (id) {
      fetchCartsum(atob(id));
    }
    FetchData();
  }, []);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify={"space-between"} h="100%">
          <Group gap={5}>
            <UnstyledButton onClick={() => nav("/home")}>
              <Image radius="md" src={logo} w={60} />
              {/* <Text hiddenFrom="sm">สินค้าผลิตภัณฑ์และสังฆทานออนไลน์</Text> */}
            </UnstyledButton>
          </Group>
          <Group h="100%" gap={0} visibleFrom="sm">
            <Flex gap={1} align={"center"}>
              {Link(data)}
            </Flex>
          </Group>
          <Group gap={10} visibleFrom={"md"}>
            {!id && !role ? (
              <>
                <Group gap={5}>
                  <Button variant="default" onClick={() => nav("/login")}>
                    เข้าสู่ระบบ
                  </Button>
                  <Button onClick={() => nav("/register")}>สมัครสมาชิก</Button>
                </Group>
              </>
            ) : (
              <>
                <Menu
                  width={"auto"}
                  position="bottom-end"
                  transitionProps={{ transition: "pop-top-right" }}
                  withinPortal
                  offset={7}
                  onClose={() => setUserMenuOpened(false)}
                  onOpen={() => setUserMenuOpened(true)}
                >
                  <Menu.Target>
                    <UnstyledButton>
                      <Group gap={10}>
                        <Indicator
                          inline
                          size={14}
                          offset={6}
                          position="bottom-end"
                          color="green"
                          withBorder
                          processing
                        >
                          <Avatar
                            size="45"
                            radius="xl"
                            color="green"
                            variant="light"
                          />
                        </Indicator>
                        <Flex direction="column" wrap="wrap">
                          <Text size="sm" fw={500}>
                            {/* name */}
                          </Text>
                        </Flex>
                        {userMenuOpened ? (
                          <IconChevronUp
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                          />
                        ) : (
                          <IconChevronDown
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                          />
                        )}
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={
                        <IconUserCircle
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={UserPage}
                    >
                      บัญชีของฉัน
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconCashRegister
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      // onClick={}
                    >
                      การซื้อของฉัน
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={
                        <IconLogout
                          style={{ width: rem(16), height: rem(16) }}
                          stroke={1.5}
                        />
                      }
                      onClick={Logout}
                    >
                      ออกจากระบบ
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
                <Tooltip label={"ตระกร้าสินค้า"}>
                  <Indicator
                    inline
                    label={cartsum}
                    size={16}
                    offset={1}
                    position="top-end"
                    mr={5}
                    onClick={() => nav("/cart")}
                  >
                    <UnstyledButton>
                      <IconShoppingCart stroke={1.5} />
                    </UnstyledButton>
                  </Indicator>
                </Tooltip>
                <Tooltip
                  label={`${
                    computedColorScheme === "light" ? "Dark" : "Light"
                  } mode`}
                >
                  <ActionIcon
                    onClick={() =>
                      setColorScheme(
                        computedColorScheme === "light" ? "dark" : "light"
                      )
                    }
                    variant="default"
                    size={"35px"}
                    visibleFrom={"md"}
                  >
                    {computedColorScheme === "light" ? (
                      <IconMoon stroke={1.5} />
                    ) : (
                      <IconSun stroke={1.5} />
                    )}
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>

          <Group gap={2}>
            {id && role && (
              <>
                <Tooltip label={"ตระกร้าสินค้า"}>
                  <Indicator
                    inline
                    label={cartsum}
                    size={16}
                    offset={1}
                    position="top-end"
                    hiddenFrom={"md"}
                    mr={15}
                    onClick={() => nav("/cart")}
                  >
                    <UnstyledButton>
                      <IconShoppingCart stroke={1.5} />
                    </UnstyledButton>
                  </Indicator>
                </Tooltip>
              </>
            )}
            <Tooltip
              label={`${
                computedColorScheme === "light" ? "Dark" : "Light"
              } mode`}
            >
              <ActionIcon
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
                variant="default"
                size={"35px"}
                hiddenFrom={"md"}
              >
                {computedColorScheme === "light" ? (
                  <IconMoon stroke={1.5} />
                ) : (
                  <IconSun stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="md"
            />
          </Group>
        </Group>
      </header>

      {/* DRAWER */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        padding="md"
        title="สินค้าผลิตภัณฑ์และสังฆทานออนไลน์"
        hiddenFrom="md"
        // zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <Flex direction="column" px={"xs"} gap={3}>
            {Link(data)}
          </Flex>
          <Divider my="sm" />
          {!id ? (
            <>
              <Group justify="center" grow pb="xl" px="md">
                <Button variant="default" onClick={() => nav("/login")}>
                  เข้าสู่ระบบ
                </Button>
                <Button onClick={() => nav("/register")}>สมัครสมาชิก</Button>
              </Group>
            </>
          ) : (
            <>
              <Group mb={20} px={20}>
                <Indicator
                  inline
                  size={14}
                  offset={6}
                  position="bottom-end"
                  color="green"
                  withBorder
                  processing
                >
                  <Avatar size="45" radius="xl" color="green" variant="light" />
                </Indicator>
                <Text size="sm" fw={500}>
                  {/* {name} */}
                </Text>
              </Group>

              <Flex direction="column" px={"xs"} gap={3}>
                <NavLink
                  label="บัญชีของฉัน"
                  leftSection={
                    <IconUserCircle
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={UserPage}
                />
                <NavLink
                  label="การซื้อของฉัน"
                  leftSection={
                    <IconCashRegister
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  // onClick={}
                />
                <NavLink
                  label="ออกจากระบบ"
                  leftSection={
                    <IconLogout
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  c={"red"}
                  onClick={Logout}
                />
              </Flex>
            </>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default Header;
