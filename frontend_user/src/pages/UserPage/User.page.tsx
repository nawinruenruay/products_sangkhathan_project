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
  CheckIcon,
  FileButton,
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
} from "@tabler/icons-react";
import { useDocumentTitle, useMediaQuery } from "@mantine/hooks";

import { AddEmail, Addphone, AddBirthday } from "./AddDatauser";
import { AddAddress } from "./AddAddress";

type FormValues = {
  name: string;
  sex: string;
  img: string;
  img_file: File | null;
  img_preview: any | ArrayBuffer | null;
};

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

  const [ModalAddAddress, setModalAddAddress] = useState<boolean>(false);

  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Birthday, setBirthday] = useState("");

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
  };

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
                  <Group justify={"space-between"} gap={25} p={10} px={30}>
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
              <Paper shadow="sm" py={25} mih={400}>
                <Group justify={"space-between"} px={30}>
                  <Text size={"lg"} fw={"bold"}>
                    ที่อยู่ของฉัน
                  </Text>
                  <Button
                    leftSection={<IconPlus />}
                    onClick={() => setModalAddAddress(true)}
                  >
                    เพิ่มที่อยู่
                  </Button>
                </Group>
                <Divider my="md" />
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="purchase">
              <Paper shadow="sm" px={30} py={25} mih={400}></Paper>
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
        title="เพิ่มที่อยู่"
        opened={ModalAddAddress}
        onClose={() => {
          setModalAddAddress(false);
        }}
        size={"md"}
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
            // FetchData();
          }}
          close={() => {
            setModalAddAddress(false);
          }}
        />
      </Modal>
    </>
  );
}
