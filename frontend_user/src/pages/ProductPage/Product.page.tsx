import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Skeleton,
  Paper,
  Flex,
  Grid,
  Card,
  Group,
  Button,
  Badge,
  Modal,
  Tabs,
  rem,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "@mantine/hooks";
import { IconBrandProducthunt } from "@tabler/icons-react";
import classes from "./Product.module.css";

export function ProductPage() {
  useDocumentTitle("สินค้า | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const { tabsValue } = useParams();
  const iconStyle = { width: rem(12), height: rem(12) };
  const nav = useNavigate();
  const [ShowIMG, setShowIMG] = useState(false);
  const [ImagePath, setImagePath] = useState("");
  const [LoadingData, setLoadingData] = useState(false);
  const [Products, setProducts] = useState([]);

  const FetchProducts = () => {
    setLoadingData(true);
    axios.get(Api + "/Product/ShowProduct").then((res) => {
      const data = res.data;
      if (data.length !== 0) {
        setProducts(data);
      }
      setLoadingData(false);
    });
  };

  const ShowImage = (path: string) => {
    setImagePath(path);
    setShowIMG(true);
  };

  const base64UrlEncode = (str: string): string => {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  const ProductDetail = (productId: string, productName: string) => {
    const encodedProductId = base64UrlEncode(productId);
    nav("/product/" + encodedProductId + "/" + productName);
  };

  useEffect(() => {
    FetchProducts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Tabs
        defaultValue="สินค้าผลิตภัณฑ์-cat.1"
        value={tabsValue}
        onChange={(tabsValue: any) => {
          nav(`/product/${tabsValue}`);
        }}
        mb={50}
      >
        <Tabs.List grow>
          <Tabs.Tab
            value="สินค้าผลิตภัณฑ์"
            leftSection={<IconBrandProducthunt style={iconStyle} />}
          >
            สินค้าผลิตภัณฑ์
          </Tabs.Tab>
          <Tabs.Tab
            value="สังฆฑานออนไลน์"
            leftSection={<IconBrandProducthunt style={iconStyle} />}
          >
            สังฆฑานออนไลน์
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="สินค้าผลิตภัณฑ์">
          {LoadingData === true ? (
            <>
              <Paper radius={8} shadow="sm" p={10}>
                <Flex direction={"row"} gap={10}>
                  <Skeleton h={200} w={300} />
                  <Skeleton h={200} w={300} />
                  <Skeleton h={200} w={300} />
                  <Skeleton h={200} w={300} />
                </Flex>
              </Paper>
            </>
          ) : (
            <>
              <Grid gutter="md" mt={20}>
                {Products.filter((i: any) => i.ptid === "1").map((i: any) => (
                  <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={i.pid}>
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      className={classes.card}
                      h={"100%"}
                      onClick={() => {
                        ProductDetail(i.pid, i.pname);
                      }}
                    >
                      <Card.Section
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={Api + i.img}
                          w={200}
                          h={150}
                          className={classes.image}
                          onClick={() => {
                            ShowImage(Api + i.img);
                          }}
                        />
                      </Card.Section>

                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{i.pname}</Text>
                        <Badge color="red">มีสินค้า {i.qty} ชิ้น</Badge>
                      </Group>

                      <Text size="sm" c="dimmed">
                        {i.price.toLocaleString()} บาท
                      </Text>
                      <Button
                        fullWidth
                        mt="md"
                        radius="md"
                        onClick={() => {
                          ProductDetail(i.pid, i.pname);
                        }}
                      >
                        รายละเอียดสินค้า
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="สังฆฑานออนไลน์">
          {LoadingData === true ? (
            <>
              <Paper radius={8} shadow="sm" p={10}>
                <Flex direction={"row"} gap={10}>
                  <Skeleton h={200} w={300} />
                  <Skeleton h={200} w={300} />
                  <Skeleton h={200} w={300} />
                  <Skeleton h={200} w={300} />
                </Flex>
              </Paper>
            </>
          ) : (
            <>
              <Grid gutter="md" mt={20}>
                {Products.filter((i: any) => i.ptid === "2").map((i: any) => (
                  <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={i.pid}>
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      className={classes.card}
                      onClick={() => {
                        ProductDetail(i.pid, i.pname);
                      }}
                    >
                      <Card.Section
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          src={Api + i.img}
                          w={200}
                          h={150}
                          className={classes.image}
                          onClick={() => {
                            ShowImage(Api + i.img);
                          }}
                        />
                      </Card.Section>

                      <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>{i.pname}</Text>
                        <Badge color="red">มีสินค้า {i.qty} ชิ้น</Badge>
                      </Group>

                      <Text size="sm" c="dimmed">
                        {i.price.toLocaleString()} บาท
                      </Text>

                      <Button
                        fullWidth
                        mt="md"
                        radius="md"
                        onClick={() => {
                          ProductDetail(i.pid, i.pname);
                        }}
                      >
                        รายละเอียดสินค้า
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </>
          )}
        </Tabs.Panel>
      </Tabs>

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
