import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useDocumentTitle } from "@mantine/hooks";

import classes from "./Home.module.css";

export function HomePage() {
  useDocumentTitle("หน้าหลัก");
  const nav = useNavigate();
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  const [Banner, setBanner] = useState([]);
  const [Products, setProducts] = useState([]);
  const [LoadingData, setLoadingData] = useState(false);
  const [ShowIMG, setShowIMG] = useState(false);
  const [ImagePath, setImagePath] = useState("");

  const FetchBanner = () => {
    setLoadingData(true);
    axios.get(Api + "/Banner/ShowBanner").then((res) => {
      const data = res.data.filter((i: any) => i.banner_status === "T");
      if (data.length !== 0) {
        setBanner(data);
      }
      setLoadingData(false);
    });
  };

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
    FetchBanner();
    FetchProducts();
  }, []);

  return (
    <>
      {LoadingData === true ? (
        <>
          <Paper radius={8} shadow="sm">
            <Flex direction={"column"} gap={10}>
              <Skeleton w={"100%"} h={450} />
            </Flex>
          </Paper>
        </>
      ) : (
        <>
          <Paper radius={8} shadow="sm">
            <Carousel
              withIndicators
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              classNames={classes}
            >
              {Array.isArray(Banner) &&
                Banner.map((img: any, key) => (
                  <Carousel.Slide key={key}>
                    <Image src={Api + img.banner_pic} radius={8} />
                  </Carousel.Slide>
                ))}
            </Carousel>
          </Paper>
        </>
      )}

      {LoadingData === true ? (
        <>
          <Paper radius={8} shadow="sm" mt={20} mb={20}>
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
          <Grid gutter="md" mt={30} mb={50}>
            {Products.map((i: any) => (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={i.pid}>
                <Card
                  shadow="sm"
                  radius="md"
                  withBorder
                  h={"100%"}
                  className={classes.card}
                  onClick={() => {
                    ProductDetail(i.pid, i.pname);
                  }}
                >
                  <Card.Section
                    style={{ display: "flex", justifyContent: "center" }}
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
