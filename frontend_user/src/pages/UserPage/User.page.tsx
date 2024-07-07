import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Avatar,
  Text,
  // Skeleton,
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
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";
import { IconUser, IconShoppingBag } from "@tabler/icons-react";
import { useDocumentTitle, useMediaQuery } from "@mantine/hooks";

import { AddEmail } from "./AddEmail";
import { Addphone } from "./AddPhone";
import { AddBirthday } from "./AddBirthday";

export function UserPage() {
  useDocumentTitle("สินค้าผลิตภัณฑ์และสังฆทานออนไลน์");
  const nav = useNavigate();
  const { tabsValue } = useParams();
  const iconStyle = { width: rem(15), height: rem(15) };
  const isMobile = useMediaQuery("(max-width: 999px)");
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingProfile, setLoadingProfile] = useState(false);
  const [ModalAddEmail, setModalAddEmail] = useState<boolean>(false);
  const [ModalAddPhone, setModalAddPhone] = useState<boolean>(false);
  const [ModalAddBirthday, setModalAddBirthday] = useState<boolean>(false);
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Img, setImg] = useState("");
  const [Sex, setSex] = useState("");
  const [Birthday, setBirthday] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
    },
    validate: {
      name: (value) =>
        value.length < 6 ? "กรุณากรอกชื่อ-นามสกุลที่ถูกต้อง" : null,
    },
  });

  const FetchData = () => {
    setLoadingProfile(true);
    axios
      .post(Api + "/User/Showuser", {
        userid: atob(id),
      })
      .then((res) => {
        const data = res.data;
        // console.log(data);
        if (data.length !== 0) {
          form.setValues({
            name: data[0].name,
          });
          setEmail(data[0].email);
          setPhone(data[0].phone);
          setSex(data[0].sex);
          setImg(data[0].img);
          setBirthday(data[0].birthday);
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

  const Submit = (v: any) => {};

  useEffect(() => {
    if (id) {
      FetchData();
    } else {
      nav("/login");
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Tabs
        defaultValue="profile"
        value={tabsValue}
        onChange={(tabsValue) => nav(`/user/account/${tabsValue}`)}
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="pills"
        mt={30}
      >
        <Grid gutter={20}>
          <Grid.Col span={{ base: 12, md: 2, lg: 2 }}>
            <Tabs.List>
              <Tabs.Tab
                value="profile"
                leftSection={<IconUser style={iconStyle} />}
              >
                บัญชีของฉัน
              </Tabs.Tab>
              <Tabs.Tab
                value="purchase"
                leftSection={<IconShoppingBag style={iconStyle} />}
              >
                การซื้อของฉัน
              </Tabs.Tab>
            </Tabs.List>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 10, lg: 10 }} w={999}>
            <form
              onSubmit={form.onSubmit((v) => {
                Submit(v);
              })}
            >
              <Tabs.Panel value="profile" pos="relative">
                <LoadingOverlay
                  visible={LoadingProfile}
                  zIndex={100}
                  overlayProps={{ radius: "sm", blur: 2 }}
                  loaderProps={{ type: "dots" }}
                />
                <Paper shadow="sm" px={30} py={25}>
                  <Text size={"lg"} fw={"bold"}>
                    ข้อมูลของฉัน
                  </Text>
                  <Text>
                    จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
                  </Text>
                  <Divider my="md" />

                  <Group justify={"space-between"} px={30} py={20} gap={50}>
                    <Flex
                      gap={10}
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
                              onClick={() => nav("/user/account/email")}
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
                              onClick={() => nav("/user/account/phone")}
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
                        <Radio.Group value={Sex} withAsterisk>
                          <Group gap={5}>
                            <Radio label="ชาย" value="1" />
                            <Radio label="หญิง" value="2" />
                            <Radio label="อื่น ๆ" value="3" />
                          </Group>
                        </Radio.Group>
                      </Group>
                      <Group gap={10}>
                        <Text>วัน/เดือน/ปี เกิด</Text>
                        {Birthday !== "0000-00-00" ? (
                          <>
                            <Text>{formatBirthday(Birthday)}</Text>
                            <UnstyledButton
                              variant="transparent"
                              c={"green"}
                              style={{ textDecoration: "underline" }}
                              // onClick={}
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
                        {Img.length > 0 ? (
                          <Avatar src={Api + Img} size={100} />
                        ) : (
                          <Avatar color={"green"} size={100} />
                        )}
                      </Center>
                      <Button>เลือกรูป</Button>
                      <Text c={"#999999"}>
                        ขนาดไฟล์: สูงสุด 1 MB ไฟล์ที่รองรับ: .JPEG, .PNG
                      </Text>
                    </Flex>
                  </Group>
                  <Button mt={5} w={"100%"} type="submit">
                    บันทึกข้อมูล
                  </Button>
                </Paper>
              </Tabs.Panel>
            </form>

            <Tabs.Panel value="purchase">
              <Paper shadow="sm" px={30} py={25}></Paper>
            </Tabs.Panel>
          </Grid.Col>
        </Grid>
      </Tabs>

      <Modal
        title="เพิ่มอีเมล"
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
            FetchData();
          }}
          close={() => {
            setModalAddEmail(false);
          }}
        />
      </Modal>
      <Modal
        title="เพิ่มหมายเลขโทรศัพท์"
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
            FetchData();
          }}
          close={() => {
            setModalAddPhone(false);
          }}
        />
      </Modal>
      <Modal
        title="เพิ่มวันเกิด"
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
            FetchData();
          }}
          close={() => {
            setModalAddBirthday(false);
          }}
        />
      </Modal>
    </>
  );
}
