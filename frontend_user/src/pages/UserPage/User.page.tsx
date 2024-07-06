import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Skeleton,
  Paper,
  Flex,
  Grid,
  Group,
  Button,
  Tabs,
  rem,
  Title,
  TextInput,
  Divider,
  Input,
  Radio,
  Center,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { IconUser, IconShoppingBag } from "@tabler/icons-react";
import { useDocumentTitle, useMediaQuery } from "@mantine/hooks";

export function UserPage() {
  useDocumentTitle("สินค้าผลิตภัณฑ์และสังฆทานออนไลน์");
  const nav = useNavigate();
  const { tabsValue } = useParams();
  const iconStyle = { width: rem(15), height: rem(15) };
  const isMobile = useMediaQuery("(max-width: 999px)");
  const { id, role } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingData, setLoadingData] = useState(false);
  const [Img, setImg] = useState("");
  const [Name, setName] = useState("");

  const FetchData = () => {
    setLoadingData(true);
    axios
      .post(Api + "/User/Showuser", {
        userid: atob(id),
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.length !== 0) {
          setName(data[0].name);
          setImg(data[0].img);
        }
        setLoadingData(false);
      });
  };

  useEffect(() => {
    if (id) {
      FetchData();
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Tabs
        defaultValue="profile"
        value={tabsValue}
        onChange={(tabsValue) => nav(`/user/${tabsValue}`)}
        orientation={isMobile ? "horizontal" : "vertical"}
        variant="pills"
        mt={30}
      >
        <Grid gutter={50}>
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
            <Tabs.Panel value="profile">
              <Paper shadow="sm" px={30} py={25}>
                <Text size={"lg"} fw={"bold"}>
                  ข้อมูลของฉัน
                </Text>
                <Text>
                  จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้
                </Text>
                <Divider my="md" />
                <Group justify={"space-between"} px={40} py={20}>
                  <Flex
                    gap={10}
                    justify="flex-start"
                    align="flex-start"
                    direction="column"
                    wrap="wrap"
                  >
                    <Flex justify={"center"} align={"center"}>
                      <Text mr={25}>ชื่อ</Text>
                      <TextInput />
                    </Flex>
                    <Flex justify={"center"} align={"center"}>
                      <Text mr={10}>อีเมล</Text>
                      <TextInput />
                    </Flex>
                    <Group>
                      <Text>เพศ</Text>
                      <Radio.Group withAsterisk>
                        <Group>
                          <Radio label="ชาย" value="1" />
                          <Radio label="หญิง" value="2" />
                          <Radio label="อื่น ๆ" value="3" />
                        </Group>
                      </Radio.Group>
                    </Group>
                    <Group>
                      <Text>วัน/เดือน/ปี เกิด</Text>
                    </Group>
                  </Flex>
                  <Flex direction={"column"}>
                    <Center>
                      <Image src={Api + Img} w={150} radius={"50%"} />
                    </Center>
                    <Button mt={15}>เลือกรูป</Button>
                    <Text c={"#999999"} mt={15}>
                      ขนาดไฟล์: สูงสุด 1 MB ไฟล์ที่รองรับ: .JPEG, .PNG
                    </Text>
                  </Flex>
                </Group>
                <Button mt={5} w={"100%"}>
                  บันทึกข้อมูล
                </Button>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="purchase">
              <Paper shadow="sm" px={30} py={25}></Paper>
            </Tabs.Panel>
            <Tabs.Panel value="email">
              <Paper shadow="sm" px={30} py={25}>
                email
              </Paper>
            </Tabs.Panel>
          </Grid.Col>
        </Grid>
      </Tabs>
    </>
  );
}
