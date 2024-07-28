import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Avatar,
  Text,
  Paper,
  Flex,
  Grid,
  Group,
  Button,
  Tabs,
  rem,
  TextInput,
  Divider,
  Radio,
  Center,
  UnstyledButton,
  Modal,
  LoadingOverlay,
  CheckIcon,
  FileButton,
  Badge,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconUserCircle,
  IconShoppingBag,
  IconCheck,
  IconCamera,
  IconPassword,
  IconMap2,
  IconPlus,
  IconX,
  IconCash,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";

import {
  AddEmail,
  Addphone,
  AddBirthday,
  AddAddress,
} from "./AddAndUpdateDATAUSER";

import { Showorderbuy } from "./Showorderbuy";

type FormValues = {
  name: string;
  sex: string;
  img: string;
  img_file: File | null;
  img_preview: any | ArrayBuffer | null;
};

type DateOptions = {
  year: "numeric" | "2-digit";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day: "numeric" | "2-digit";
};

interface Items {
  order_id: any;
  order_date: any;
  status: any;
}

export function UserPage() {
  const nav = useNavigate();
  const { tabsValue } = useParams();
  const iconStyle = { width: rem(15), height: rem(15) };
  const isMobile = useMediaQuery("(max-width: 999px)");
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingProfile, setLoadingProfile] = useState(false);
  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const [ModalAddEmail, setModalAddEmail] = useState<boolean>(false);
  const [ModalAddPhone, setModalAddPhone] = useState<boolean>(false);
  const [ModalAddBirthday, setModalAddBirthday] = useState<boolean>(false);
  const [ModalAddAddress, setModalAddAddress] = useState<boolean>(false);

  const [ModalShoworderbuy, setModalShoworderbuy] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [Table, setTable] = useState<any[]>([]);
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Birthday, setBirthday] = useState("");
  const [IsAddress, setIsAddress] = useState("");
  const [DataAddress, setDataAddress] = useState<any[]>([]);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      sex: "",
      img: "",
      img_file: null,
      img_preview: null,
    },
    validate: {
      name: (value) =>
        value.length < 6 ? "กรุณากรอกชื่อ-นามสกุลที่ถูกต้อง" : null,
    },
  });

  const LoadDatatable = () => {
    setLoadingProfile(true);
    if (id) {
      axios
        .post(Api + "User/Showorderbuy/", {
          userid: atob(id),
        })
        .then((res) => {
          const data = res.data;
          // console.log(data);
          if (data.length !== 0) {
            const configData = data.map((i: any, key: any) => ({
              ...i,
              id: key + 1,
            }));
            setTable(configData);
          }
          setLoadingProfile(false);
        });
    }
  };

  const FetchData = () => {
    setLoadingProfile(true);
    axios
      .post(Api + "/User/Showuser", {
        userid: atob(id),
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          form.setValues({
            name: data[0].name,
            sex: data[0].sex,
            img: data[0].img,
          });
          setEmail(data[0].email);
          setPhone(data[0].phone);
          setBirthday(data[0].birthday);
          setIsAddress(data[0].address);
          setDataAddress(data);
        }
        setLoadingProfile(false);
      });
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length < 2) return number;
    return "*".repeat(number.length - 2) + number.slice(-2);
  };

  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length < 2) return email;
    return `${localPart.slice(0, 2)}***@${domain}`;
  };

  const formatBirthday = (birthday: string) => {
    const [year, month] = birthday.split("-");
    return `**/${month}/${year.slice(0, 2)}**`;
  };

  const options2: DateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const handleFileChange = (files: any) => {
    form.setValues({
      img_file: null,
      img_preview: null,
    });
    if (files) {
      form.setValues({
        img_file: files,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValues({
          img_preview: reader.result,
        });
      };
      reader.readAsDataURL(files);
    }
  };

  const Submit = (val: any) => {
    setLoadingSubmit(true);
    setTimeout(() => {
      if (val.img_file !== null) {
        const Update = new FormData();
        Update.append("userid", atob(id));
        Update.append("file", val.img_file);
        Update.append("typeimg", "update");
        axios.post(Api + "User/UploadIMG", Update).then(() => {
          axios
            .post(Api + "User/Updatedata", {
              userid: atob(id),
              name: val.name,
              sex: val.sex,
              typeadd: "name_sex",
            })
            .then((res) => {
              if (res.data === 200) {
                setLoadingSubmit(false);
                Notifications.show({
                  title: "บันทึกข้อมูลสำเร็จ",
                  message: "คุณได้เพิ่มข้อมูลเรียบร้อยแล้ว",
                  autoClose: 2000,
                  color: "green",
                  icon: <IconCheck />,
                });
              }
            });
        });
      } else {
        const Update = new FormData();
        Update.append("file", val.img);
        Update.append("typeimg", "update");
        axios.post(Api + "User/UploadIMG", Update).then(() => {
          axios
            .post(Api + "User/Updatedata", {
              userid: atob(id),
              name: val.name,
              sex: val.sex,
              typeadd: "name_sex",
            })
            .then((res) => {
              if (res.data === 200) {
                setLoadingSubmit(false);
                Notifications.show({
                  title: "บันทึกข้อมูลสำเร็จ",
                  message: "คุณได้เพิ่มข้อมูลเรียบร้อยแล้ว",
                  autoClose: 2000,
                  color: "green",
                  icon: <IconCheck />,
                });
              }
            });
        });
      }
    }, 5000);
  };

  const OpenModalShoworderbuy = (order_id: any) => {
    setSelectedOrderId(order_id);
    setModalShoworderbuy(true);
  };

  const CancelOrder = (order_id: any) => {
    Swal.fire({
      title: "คุณต้องการยกเลิกออเดอร์?",
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#40C057",
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(Api + "Buy/CancelOrder", {
            order_id: order_id,
          })
          .then((res) => {
            if (res.data === 200) {
              Notifications.show({
                title: "ยกเลิกออเดอร์สำเร็จ",
                message: "คุณได้ยกเลิกออเดอร์เรียบร้อยแล้ว",
                autoClose: 2000,
                color: "green",
                icon: <IconCheck />,
              });
              LoadDatatable();
            }
          });
      }
    });
  };

  const Checkout = (order_id: any) => {
    nav("/user/checkout/" + btoa(order_id));
  };

  useEffect(() => {
    if (id) {
      FetchData();
      LoadDatatable();
    } else {
      nav("/login");
    }
    window.scrollTo(0, 0);
  }, []);

  const PAGE_SIZES = [5, 10, 15];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [record, setRecord] = useState<Items[]>([]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecord(
      Table.slice(from, to).map((i: any, key: any) => ({
        ...i,
        id: from + key + 1,
      }))
    );
  }, [page, pageSize, Table]);

  return (
    <>
      <Tabs
        defaultValue="profile"
        value={tabsValue}
        onChange={(tabsValue) => nav(`/user/account/${tabsValue}`)}
        orientation={isMobile ? "horizontal" : "vertical"}
        // variant="pills"
        variant="outline"
        mt={15}
        p={10}
      >
        <Grid gutter={20}>
          <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
            <Tabs.List grow>
              <Tabs.Tab
                value="profile"
                leftSection={<IconUserCircle style={iconStyle} />}
              >
                บัญชีของฉัน
              </Tabs.Tab>
              <Tabs.Tab
                value="address"
                leftSection={<IconMap2 style={iconStyle} />}
              >
                ที่อยู่ของฉัน
              </Tabs.Tab>
              <Tabs.Tab
                value="purchase"
                leftSection={<IconShoppingBag style={iconStyle} />}
              >
                การซื้อของฉัน
              </Tabs.Tab>
              <Tabs.Tab
                value="password"
                leftSection={<IconPassword style={iconStyle} />}
              >
                เปลี่ยนรหัสผ่าน
              </Tabs.Tab>
            </Tabs.List>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 10, lg: 10 }} w={999}>
            <form
              onSubmit={form.onSubmit((val) => {
                Submit(val);
              })}
            >
              <Tabs.Panel value="profile" pos="relative">
                <LoadingOverlay
                  visible={LoadingProfile}
                  zIndex={100}
                  overlayProps={{ radius: "sm", blur: 2 }}
                  loaderProps={{ type: "dots" }}
                />
                <Paper shadow="sm" py={25} mih={400}>
                  <Flex direction={"column"} px={30}>
                    <Text size={"lg"} fw={"bold"}>
                      ข้อมูลของฉัน
                    </Text>
                    <Text>
                      จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
                    </Text>
                  </Flex>
                  <Divider my="md" />
                  <Group justify={"space-between"} gap={25} px={30}>
                    <Flex
                      gap={15}
                      justify="flex-start"
                      align="flex-start"
                      direction="column"
                      wrap="wrap"
                    >
                      <Flex align={"center"} gap={10}>
                        <Text>ชื่อ</Text>
                        <TextInput {...form.getInputProps("name")} />
                      </Flex>
                      <Flex align={"center"} gap={10}>
                        <Text>อีเมล</Text>
                        {Email.length > 0 ? (
                          <>
                            <Text>{formatEmail(Email)}</Text>
                            <UnstyledButton
                              variant="transparent"
                              c={"green"}
                              style={{ textDecoration: "underline" }}
                              onClick={() => setModalAddEmail(true)}
                            >
                              เปลี่ยน
                            </UnstyledButton>
                          </>
                        ) : (
                          <>
                            <UnstyledButton
                              variant="transparent"
                              c={"green"}
                              style={{ textDecoration: "underline" }}
                              onClick={() => setModalAddEmail(true)}
                            >
                              เพิ่ม
                            </UnstyledButton>
                          </>
                        )}
                      </Flex>
                      <Flex align={"center"} gap={10}>
                        <Text>หมายเลขโทรศัพท์</Text>
                        {Phone.length > 0 ? (
                          <>
                            <Text>{formatPhoneNumber(Phone)}</Text>
                            <UnstyledButton
                              variant="transparent"
                              c={"green"}
                              style={{ textDecoration: "underline" }}
                              onClick={() => setModalAddPhone(true)}
                            >
                              เปลี่ยน
                            </UnstyledButton>
                          </>
                        ) : (
                          <>
                            <UnstyledButton
                              variant="transparent"
                              c={"green"}
                              style={{ textDecoration: "underline" }}
                              onClick={() => setModalAddPhone(true)}
                            >
                              เพิ่ม
                            </UnstyledButton>
                          </>
                        )}
                      </Flex>
                      <Group gap={5}>
                        <Text>เพศ</Text>
                        <Radio.Group
                          value={form.values.sex}
                          onChange={(value) => form.setValues({ sex: value })}
                          withAsterisk
                        >
                          <Group gap={5}>
                            <Radio label="ชาย" icon={CheckIcon} value="1" />
                            <Radio label="หญิง" icon={CheckIcon} value="2" />
                            <Radio label="อื่น ๆ" icon={CheckIcon} value="3" />
                          </Group>
                        </Radio.Group>
                      </Group>
                      <Group gap={10}>
                        <Text>วันเกิด</Text>
                        {Birthday !== "0000-00-00" ? (
                          <>
                            <Text>{formatBirthday(Birthday)}</Text>
                            <UnstyledButton
                              variant="transparent"
                              c={"green"}
                              style={{ textDecoration: "underline" }}
                              onClick={() => setModalAddBirthday(true)}
                            >
                              เปลี่ยน
                            </UnstyledButton>
                          </>
                        ) : (
                          <UnstyledButton
                            variant="transparent"
                            c={"green"}
                            style={{ textDecoration: "underline" }}
                            onClick={() => setModalAddBirthday(true)}
                          >
                            เพิ่ม
                          </UnstyledButton>
                        )}
                      </Group>
                    </Flex>
                    <Flex direction={"column"} gap={10}>
                      <Center>
                        <Avatar
                          src={
                            form.values.img_preview === null
                              ? Api + form.values.img
                              : form.values.img_preview
                          }
                          size={100}
                          color={"green"}
                        />
                      </Center>
                      <FileButton
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg"
                      >
                        {(props) => (
                          <Button variant="outline" {...props}>
                            <IconCamera />
                          </Button>
                        )}
                      </FileButton>
                      <Text c={"#999999"} fz={"14px"}>
                        ขนาดไฟล์: สูงสุด 1 MB ไฟล์ที่รองรับ: .JPEG, .PNG
                      </Text>
                    </Flex>
                    <Button
                      w={"100%"}
                      type="submit"
                      loading={LoadingSubmit}
                      loaderProps={{ type: "dots" }}
                    >
                      บันทึกข้อมูล
                    </Button>
                  </Group>
                </Paper>
              </Tabs.Panel>
            </form>

            <Tabs.Panel value="address">
              <Paper shadow="sm" py={25} mih={400} pos={"relative"}>
                <LoadingOverlay
                  visible={LoadingProfile}
                  zIndex={100}
                  overlayProps={{ radius: "sm", blur: 2 }}
                  loaderProps={{ type: "dots" }}
                />
                <Group justify={"space-between"} px={30}>
                  <Text size={"lg"} fw={"bold"}>
                    ที่อยู่ของฉัน
                  </Text>
                  {IsAddress !== "" ? (
                    <></>
                  ) : (
                    <Button
                      leftSection={<IconPlus />}
                      onClick={() => setModalAddAddress(true)}
                    >
                      เพิ่มที่อยู่
                    </Button>
                  )}
                </Group>
                <Divider my="md" />
                {IsAddress !== "" ? (
                  DataAddress.map((i: any, key) => (
                    <Group px={30} key={key} justify={"space-between"}>
                      <Flex direction={"column"}>
                        <Text>
                          {i.ad_name} | {i.ad_phone}
                        </Text>
                        <Text>{i.address}</Text>
                        <Text>
                          {i.ad_tambon}, {i.ad_amphure}, จังหวัด
                          {i.ad_province}, {i.zip_code}
                        </Text>
                      </Flex>
                      <Flex>
                        <Button
                          variant={"outline"}
                          onClick={() => setModalAddAddress(true)}
                        >
                          แก้ไข
                        </Button>
                      </Flex>
                    </Group>
                  ))
                ) : (
                  <></>
                )}
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="purchase">
              <Paper shadow="sm" py={25} mih={400} pos={"relative"}>
                <LoadingOverlay
                  visible={LoadingProfile}
                  zIndex={100}
                  overlayProps={{ radius: "sm", blur: 2 }}
                  loaderProps={{ type: "dots" }}
                />
                <Group justify={"space-between"} px={30}>
                  <Text size={"lg"} fw={"bold"}>
                    การซื้อของฉัน
                  </Text>
                </Group>
                <Divider my="md" />
                <Box>
                  <DataTable
                    styles={{
                      header: {
                        height: "50px",
                      },
                    }}
                    minHeight={200}
                    idAccessor="order_id"
                    loaderType="dots"
                    highlightOnHover
                    columns={[
                      {
                        accessor: "id",
                        title: "ลำดับ",
                        textAlign: "center",
                      },
                      {
                        accessor: "order_date",
                        textAlign: "center",
                        title: "วันที่สั่งซื้อ",
                        render: ({ order_date }) => (
                          <>
                            {new Date(order_date).toLocaleDateString(
                              "TH-th",
                              options2
                            )}
                          </>
                        ),
                      },
                      {
                        accessor: "order",
                        textAlign: "center",
                        title: "รายการสินค้าที่สั่งซื้อ",
                        render: ({ order_id }) => (
                          <>
                            <Button
                              h={30}
                              variant="outline"
                              radius="md"
                              color="blue"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                OpenModalShoworderbuy(order_id);
                              }}
                            >
                              คลิกเพื่อดูรายการสินค้าที่สั่งซื้อ
                            </Button>
                          </>
                        ),
                      },
                      {
                        accessor: "status",
                        textAlign: "center",
                        title: "สถานะ",
                        render: ({ status }) => (
                          <>
                            <Flex align={"center"} justify={"center"}>
                              {status == 1 ? (
                                <Badge color="yellow" size="lg" variant="light">
                                  รอการชำระเงิน
                                </Badge>
                              ) : status == 2 ? (
                                <Badge color="yellow" size="lg" variant="light">
                                  รอตรวจสอบการชำระเงิน
                                </Badge>
                              ) : status == 3 ? (
                                <Badge color="green" size="lg" variant="light">
                                  ชำระเงินเรียบร้อยแล้ว
                                </Badge>
                              ) : status == 5 ? (
                                <Badge color="red" size="lg" variant="light">
                                  ยกเลิกการสั่งซื้อ
                                </Badge>
                              ) : (
                                <Badge color="black" size="lg" variant="light">
                                  test123
                                </Badge>
                              )}
                            </Flex>
                          </>
                        ),
                      },
                      {
                        accessor: "xx",
                        textAlign: "center",
                        title: "จัดการ",
                        render: ({ status, order_id }) => (
                          <Flex align={"center"} justify={"center"} gap={5}>
                            {status == 1 ? (
                              <>
                                <Button
                                  h={30}
                                  variant="outline"
                                  leftSection={<IconCash />}
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    Checkout(order_id);
                                  }}
                                >
                                  ชำระเงิน
                                </Button>
                                <Button
                                  h={30}
                                  variant="outline"
                                  color="red"
                                  leftSection={<IconX />}
                                  loading={LoadingSubmit}
                                  loaderProps={{ type: "dots" }}
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    CancelOrder(order_id);
                                  }}
                                >
                                  ยกเลิก
                                </Button>
                              </>
                            ) : status == 2 ? (
                              <></>
                            ) : status == 3 ? (
                              <></>
                            ) : status == 5 ? (
                              <></>
                            ) : (
                              <></>
                            )}
                          </Flex>
                        ),
                      },
                    ]}
                    totalRecords={Table.length}
                    recordsPerPage={pageSize}
                    page={page}
                    records={record}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    paginationText={({ from, to, totalRecords }) =>
                      `แสดง ${from} ถึง ${to} ของ ${totalRecords} รายการ`
                    }
                    recordsPerPageLabel="แสดงรายการ"
                  />
                </Box>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="password">
              <Paper shadow="sm" px={30} py={25} mih={400}></Paper>
            </Tabs.Panel>
          </Grid.Col>
        </Grid>
      </Tabs>

      <Modal
        title="รายการสินค้าที่สั่งซื้อ"
        opened={ModalShoworderbuy}
        onClose={() => {
          setModalShoworderbuy(false);
          setSelectedOrderId(null);
        }}
        size={"lg"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Showorderbuy order={selectedOrderId} />
      </Modal>

      <Modal
        title="อีเมล"
        opened={ModalAddEmail}
        onClose={() => {
          setModalAddEmail(false);
        }}
        size={"md"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <AddEmail
          closeWithSuccess={() => {
            setModalAddEmail(false);
            Notifications.show({
              title: "เพิ่มอีเมลสำเร็จ",
              message: "คุณได้เพิ่มอีเมลเรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            // FetchData();
          }}
          close={() => {
            setModalAddEmail(false);
          }}
        />
      </Modal>
      <Modal
        title="หมายเลขโทรศัพท์"
        opened={ModalAddPhone}
        onClose={() => {
          setModalAddPhone(false);
        }}
        size={"md"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Addphone
          closeWithSuccess={() => {
            setModalAddPhone(false);
            Notifications.show({
              title: "เพิ่มหมายเลขโทรศัพท์สำเร็จ",
              message: "คุณได้เพิ่มหมายเลขโทรศัพท์เรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            // FetchData();
          }}
          close={() => {
            setModalAddPhone(false);
          }}
        />
      </Modal>
      <Modal
        title="วันเกิด"
        opened={ModalAddBirthday}
        onClose={() => {
          setModalAddBirthday(false);
        }}
        size={"md"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <AddBirthday
          closeWithSuccess={() => {
            setModalAddBirthday(false);
            Notifications.show({
              title: "เพิ่มวันเกิดสำเร็จ",
              message: "คุณได้เพิ่มวันเกิดเรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            // FetchData();
          }}
          close={() => {
            setModalAddBirthday(false);
          }}
        />
      </Modal>
      <Modal
        title="ที่อยู่ใหม่"
        opened={ModalAddAddress}
        onClose={() => {
          setModalAddAddress(false);
        }}
        size={"auto"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <AddAddress
          closeWithSuccess={() => {
            setModalAddAddress(false);
            Notifications.show({
              title: "เพิ่มที่อยู่สำเร็จ",
              message: "คุณได้ที่เพิ่มอยู่เรียบร้อยแล้ว",
              autoClose: 2000,
              color: "green",
              icon: <IconCheck />,
            });
            FetchData();
          }}
          close={() => {
            setModalAddAddress(false);
          }}
        />
      </Modal>
    </>
  );
}
