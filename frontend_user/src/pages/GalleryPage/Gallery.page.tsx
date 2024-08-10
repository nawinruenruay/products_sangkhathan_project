import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Paper,
  Group,
  Card,
  Grid,
  Flex,
  Skeleton,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { IconCalendarMonth } from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";
import banner from "../../assets/img/banner-gallery.png";
import classes from "./Gallery.module.css";

export function GalleryPage() {
  useDocumentTitle("ภาพกิจกรรม | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  const nav = useNavigate();
  const autoplay = useRef(Autoplay({ delay: 3000 }));
  const [Gallery, setGallery] = useState([]);
  const [LoadingData, setLoadingData] = useState(false);

  const FetchGellery = () => {
    setLoadingData(true);
    axios.get(Api + "/Activity/ShowActivity").then((res) => {
      const data = res.data;
      if (data.length !== 0) {
        setGallery(data);
      }
      setLoadingData(false);
    });
  };

  const formatDateThai = (dateStr: any) => {
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const date = new Date(dateStr);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
  };

  const ViewGalley = (v1: string, v2: string) => {
    nav("/gallery/" + v1 + "/" + v2);
  };

  useEffect(() => {
    FetchGellery();
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
            <Image src={banner} radius={8} />
          </Carousel.Slide>
        </Carousel>
      </Paper>

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
          <Grid gutter="md" mt={20} m={5} mb={50}>
            {Gallery.map((i: any) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={i.act_id}>
                <Card
                  shadow="sm"
                  withBorder
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    ViewGalley(i.act_id, i.act_name);
                  }}
                >
                  <Card.Section
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Image src={Api + i.act_pic} className={classes.image} />
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Text lineClamp={3}>{i.act_name}</Text>
                  </Group>

                  <Group gap={2}>
                    <IconCalendarMonth size={20} />
                    <Text size="sm" c="dimmed">
                      {formatDateThai(i.act_date)}
                    </Text>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
