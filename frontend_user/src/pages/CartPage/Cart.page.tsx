import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Paper,
  Flex,
  Button,
  Anchor,
  Box,
  Breadcrumbs,
  UnstyledButton,
  Tooltip,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { NavLink as Nl, useNavigate } from "react-router-dom";
import {
  IconMoodSad,
  IconX,
  IconChevronRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";

import classes from "./Card.module.css";
import cartempty from "../../assets/img/cartempty.png";

import { useCartsum } from "../../components/CartContext";

export function CartPage() {
  const { cartsum, fetchCartsum } = useCartsum();
  const nav = useNavigate();
  useDocumentTitle("ตระกร้าสินค้า");
  // const dataUser = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingData, setLoadingData] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const totalAmount = Data.reduce((sum: any, i: any) => sum + i.total, 0);

  const LoadData = (v: any) => {
    setLoadingData(true);
    if (v) {
      axios
        .post(Api + "Cart/Showcart/", {
          username: v,
        })
        .then((res) => {
          const data = res.data;
          // console.log(data);
          if (data.length !== 0) {
            setData(data);
          }
          setLoadingData(false);
        });
    }
  };

  // const Buy = () => {
  //   if (dataUser.username) {
  //     axios
  //       .post(Api + "Buy/Buyproduct", {
  //         username: dataUser.username,
  //       })
  //       .then((res) => {
  //         if (res.data === 200) {
  //           Notifications.show({
  //             title: "สั่งซื้อสินค้าสำเร็จ",
  //             message: "คุณสั่งซื้อสินค้าเรียบร้อยแล้ว",
  //             autoClose: 2000,
  //             color: "green",
  //             icon: <IconCheck />,
  //           });
  //           fetchCartsum(dataUser.username);
  //           LoadData(dataUser.username);
  //           if (Data.length >= 1) {
  //             setData([]);
  //           }
  //         }
  //       });
  //   }
  // };

  const Delcart = (qty: number, price: number, pid: string) => {
    if (id && qty && price && pid) {
      axios
        .post(Api + "Cart/Delcart", {
          qty: qty,
          price: price,
          pid: pid,
          username: atob(id),
        })
        .then((res) => {
          if (res.data === 200) {
            fetchCartsum(atob(id));
            LoadData(atob(id));
            if (Data.length === 1) {
              setData([]);
            }
          }
        });
    }
  };

  const Plus = (pid: string, qty: number) => {
    if (id && pid) {
      axios
        .post(Api + "Cart/Plus", {
          username: atob(id),
          pid: pid,
          qty: qty,
        })
        .then((res) => {
          if (res.data === 200) {
            fetchCartsum(atob(id));
            LoadData(atob(id));
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

  const Minus = (pid: string, qty: number) => {
    if (qty <= 1) {
      return;
    }
    if (id && pid) {
      axios
        .post(Api + "Cart/Minus", {
          username: atob(id),
          pid: pid,
          qty: qty,
        })
        .then((res) => {
          if (res.data === 200) {
            fetchCartsum(atob(id));
            LoadData(atob(id));
          }
        });
    }
  };

  const RandomId = (length = 100) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const items = [
    { title: "สินค้า", href: "/product" },
    { title: "ตระกร้าสินค้า", href: "/cart" },
  ].map((item, index) => (
    <Anchor key={index} component={Nl} to={item.href} fz={"h5"}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    if (!id) {
      nav("/login");
    }
    if (id) {
      LoadData(atob(id));
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Breadcrumbs
        separatorMargin={"xs"}
        mb={20}
        ml={20}
        separator={<IconChevronRight stroke={1} />}
      >
        {items}
      </Breadcrumbs>
      <Flex gap={30} direction="column">
        {Data.length !== 0 ? (
          <>
            <Paper shadow="xs">
              <DataTable
                styles={{
                  header: {
                    height: "50px",
                  },
                }}
                minHeight={350}
                idAccessor="pid"
                fetching={LoadingData}
                loaderType="dots"
                noRecordsText="ไม่มีสินค้าในตระกร้า"
                noRecordsIcon={
                  <Box p={4} mb={4} className={classes.noRecordsBox}>
                    <IconMoodSad size={36} strokeWidth={1.5} />
                  </Box>
                }
                highlightOnHover
                columns={[
                  {
                    accessor: "pname",
                    title: "สินค้า",
                    render: ({ pname, img, pid }) => (
                      <UnstyledButton
                        onClick={() => nav(`/product/${pid}/${pname}`)}
                      >
                        <Flex align={"center"}>
                          <Image src={Api + img} w={45} />
                          <Text ml={15}>{pname}</Text>
                        </Flex>
                      </UnstyledButton>
                    ),
                  },
                  {
                    accessor: "price",
                    textAlign: "center",
                    title: "ราคาต่อชิ้น",
                    render: ({ price }) => (
                      <Text>฿{price.toLocaleString()}</Text>
                    ),
                  },
                  {
                    accessor: "qty",
                    textAlign: "center",
                    title: "จำนวน",
                    render: ({ qty, pid }) => (
                      <>
                        <Flex justify={"center"}>
                          <Button
                            variant="default"
                            radius={0}
                            onClick={() => Minus(pid, qty)}
                            disabled={qty === 1}
                          >
                            <IconMinus size={16} />
                          </Button>
                          <TextInput
                            radius={0}
                            w={70}
                            value={qty}
                            onChange={() => {}}
                            classNames={{ input: classes.textinput }}
                          />
                          <Button
                            variant="default"
                            radius={0}
                            onClick={() => Plus(pid, qty)}
                          >
                            <IconPlus size={16} />
                          </Button>
                        </Flex>
                      </>
                    ),
                  },
                  {
                    accessor: "total",
                    textAlign: "center",
                    title: "ราคารวม",
                    render: ({ total }) => (
                      <Text c={"green"} fw={"bold"}>
                        ฿{total.toLocaleString()}
                      </Text>
                    ),
                  },
                  {
                    accessor: "del",
                    title: "ลบ",
                    textAlign: "center",
                    render: ({ qty, price, pid }) => (
                      <Tooltip label="ลบสินค้า">
                        <ActionIcon
                          color="red"
                          onClick={() => Delcart(qty, price, pid)}
                          variant="transparent"
                        >
                          <IconX />
                        </ActionIcon>
                      </Tooltip>
                    ),
                  },
                ]}
                records={Data}
              />
            </Paper>
            {/* <Divider variant="dashed" /> */}
            <Paper shadow="xs" p={30}>
              <Flex justify={"space-between"}>
                <Text fz={"lg"} fw={"bold"}>
                  ราคารวม ({cartsum} ชิ้น) :
                </Text>
                <Text fz={"lg"} fw={"bold"}>
                  ฿{totalAmount.toLocaleString()} บาท
                </Text>
              </Flex>
              <Flex justify={"flex-end"} mt={20}>
                <Button
                  onClick={() => {
                    const ramdomId = RandomId();
                    nav("/checkout/" + ramdomId);
                  }}
                  w={"100%"}
                >
                  สั่งซื้อสินค้า
                </Button>
              </Flex>
            </Paper>
            {/* <Paper shadow="xs">
              <Flex gap={15} justify={"space-between"} align={"center"} p={15}>
                <Text fw={"bold"}>
                  รวม ({cartsum} ชิ้น) : ฿{totalAmount} บาท
                </Text>
                <Button w={150} onClick={Buy}>
                  สั่งสินค้า
                </Button>
              </Flex>
            </Paper> */}
          </>
        ) : (
          <>
            <Flex
              justify={"center"}
              align={"center"}
              direction={"column"}
              wrap={"wrap"}
              mt={50}
              w={"100%"}
            >
              <Image src={cartempty} w={300} />
              <Text fw={"bold"}>ตระกร้าสินค้า ว่างอยู่นะ!</Text>
              <Button onClick={() => nav("/product")} mt={20}>
                เลือกสินค้าได้เลย
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
}
