import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Paper,
  Flex,
  Grid,
  Group,
  Button,
  Badge,
  Modal,
  Anchor,
  Breadcrumbs,
  TextInput,
  LoadingOverlay,
} from "@mantine/core";
import { useParams, NavLink as Nl, useNavigate } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import {
  IconMinus,
  IconPlus,
  IconMoodSad,
  IconCheck,
  IconChevronRight,
} from "@tabler/icons-react";

import classes from "./Product.module.css";
import { useCartsum } from "../../components/CartContext";
import Swal from "sweetalert2";

export function ProductDetailPage() {
  const nav = useNavigate();
  const { v1, v2 } = useParams<{ v1: any; v2: any }>();
  const [LoadingData, setLoadingData] = useState(false);
  const [Data, setData] = useState([]);
  const [ShowIMG, setShowIMG] = useState(false);
  const [ImagePath, setImagePath] = useState("");
  const [Price, setPrice] = useState("");
  const [Qty, setQty] = useState(1);
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const { fetchCartsum } = useCartsum();

  const LoadData = (v1: any) => {
    setLoadingData(true);
    axios
      .post(Api + "Product/postShowproduct/", {
        pid: atob(v1),
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          setData(data);
          setPrice(data[0].price);
        }
        setLoadingData(false);
      });
  };

  const Addcart = () => {
    if (!id) {
      nav("/login");
    }
    if (id) {
      axios
        .post(Api + "Cart/Addcart", {
          qty: Qty,
          price: Price,
          pid: atob(v1),
          userid: atob(id),
        })
        .then((res) => {
          if (res.data === 200) {
            Notifications.show({
              title: "เพิ่มสินค้าเรียบร้อย",
              message: "คุณได้เพิ่มสินค้าลงในตระกร้าแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            fetchCartsum(atob(id));
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "info",
              iconColor: "red",
              text: res.data.message,
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
        });
    }
  };

  const ShowImage = (path: string) => {
    setImagePath(path);
    setShowIMG(true);
  };

  const items = [
    { title: "สินค้า", href: "/product" },
    { title: v2, href: "" },
  ].map((item, index) => (
    <Anchor key={index} component={Nl} to={item.href} fz={"h5"}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    LoadData(v1);
    window.scrollTo(0, 0);
  }, [v1]);

  return (
    <>
      <Breadcrumbs
        separatorMargin={"xs"}
        ml={20}
        mb={20}
        separator={<IconChevronRight stroke={1} />}
      >
        {items}
      </Breadcrumbs>

      {/* {LoadingData === true ? (
        <>
          <Paper radius={8} shadow="sm" p={10}>
            <Flex direction={"column"} gap={10}>
              <Skeleton w={"100%"} h={500} />
            </Flex>
          </Paper>
        </>
      ) : ( */}
      <>
        <Paper radius={5} shadow="sm" p={15} mb={50} pos={"relative"} mih={500}>
          <LoadingOverlay
            visible={LoadingData}
            zIndex={100}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ type: "dots" }}
          />
          {Data.map((i: any, key) => (
            <Grid key={key} gutter={50}>
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Image
                  radius="md"
                  src={Api + i.img}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    ShowImage(Api + i.img);
                  }}
                  className={classes.image}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <Flex justify="center" direction="column" wrap="wrap">
                  {/* TITLE */}
                  <Group mt={40}>
                    <Badge color={"red"} size={"lg"}>
                      แนะนำ
                    </Badge>
                    <Text size={"xl"}>{i.pname}</Text>
                  </Group>
                  <Text size={"30px"} mt={20} c={"green"}>
                    ฿ {i.price.toLocaleString()} บาท
                  </Text>

                  {/* DETAIL */}
                  {i.qty > 0 ? (
                    <>
                      <Text mt={40}>มีสินค้าทั้งหมด {i.qty} ชิ้น</Text>
                    </>
                  ) : (
                    <>
                      <Group gap={5} mt={30}>
                        <Text c={"red"}>สินค้าหมด</Text>
                        <IconMoodSad size={30} color={"red"} />
                      </Group>
                    </>
                  )}

                  {/* BUTTON */}
                  {i.qty > 0 ? (
                    <>
                      <Group mt={30}>
                        <Text>จำนวน </Text>
                        <Group gap={0} align="center">
                          <Button
                            variant="default"
                            radius={0}
                            onClick={() => setQty((v) => (v > 1 ? v - 1 : 1))}
                          >
                            <IconMinus size={16} />
                          </Button>
                          <TextInput
                            radius={0}
                            w={70}
                            value={Qty}
                            onChange={(e: any) => {
                              const value = e.currentTarget.value;
                              if (/^\d*$/.test(value)) {
                                const newQty = parseInt(value, 10);
                                if (newQty <= i.qty) {
                                  setQty(newQty);
                                }
                              }
                            }}
                            classNames={{ input: classes.textinput }}
                          />
                          <Button
                            variant="default"
                            radius={0}
                            onClick={() =>
                              setQty((v) => (v < i.qty ? v + 1 : v))
                            }
                          >
                            <IconPlus size={16} />
                          </Button>
                        </Group>
                      </Group>
                      <Flex mt={25} gap={10}>
                        <Button w={"100%"} onClick={Addcart}>
                          เพิ่มไปยังตระกร้าสินค้า
                        </Button>
                      </Flex>
                    </>
                  ) : (
                    <></>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
          ))}
        </Paper>
      </>
      {/* )} */}

      <Modal
        onClose={() => {
          setShowIMG(false);
          setImagePath("");
        }}
        opened={ShowIMG}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size={"auto"}
        withCloseButton={false}
        classNames={{
          content: classes.customModal,
          header: classes.customModal,
        }}
      >
        <Image src={ImagePath} />
      </Modal>
    </>
  );
}
