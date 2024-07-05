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
  Card,
  Group,
  Button,
  Badge,
  Modal,
  Tabs,
  rem,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { IconBrandProducthunt } from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";

import p1 from "../../assets/img/banner_product1.png";
import p2 from "../../assets/img/banner_product2.png";
import classes from "./Product.module.css";

export function ProductPage() {
  useDocumentTitle("สินค้าผลิตภัณฑ์และสังฆทานออนไลน์");
  const { tabsValue } = useParams();
  const autoplay = useRef(Autoplay({ delay: 3000 }));
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

  const ProductDetail = (v1: string, v2: string) => {
    nav("/product/" + btoa(v1) + "/" + v2);
  };

  useEffect(() => {
    FetchProducts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Paper radius={8} shadow="sm">
        <Carousel
          withIndicators
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          classNames={classes}
        >
          <Carousel.Slide>
            <Image src={p1} radius={8} />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image src={p2} radius={8} />
          </Carousel.Slide>
        </Carousel>
      </Paper>

      <Tabs
        defaultValue="p1"
        value={tabsValue}
        onChange={(tabsValue) => nav(`/product/${tabsValue}`)}
        mt={30}
        mb={50}
      >
        <Tabs.List>
          <Tabs.Tab
            value="p1"
            leftSection={<IconBrandProducthunt style={iconStyle} />}
          >
            สินค้าผลิตภัณฑ์
          </Tabs.Tab>
          <Tabs.Tab
            value="p2"
            leftSection={<IconBrandProducthunt style={iconStyle} />}
          >
            สังฆฑานออนไลน์
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="p1">
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

        <Tabs.Panel value="p2">
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
