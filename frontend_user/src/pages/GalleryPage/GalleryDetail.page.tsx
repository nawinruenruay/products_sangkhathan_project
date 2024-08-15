import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Image,
  Container,
  Text,
  Skeleton,
  Paper,
  Grid,
  Group,
  Card,
  Blockquote,
  Anchor,
  Breadcrumbs,
} from "@mantine/core";
import { NavLink as Nl, useParams } from "react-router-dom";
import {
  IconInfoCircle,
  IconCalendarMonth,
  IconChevronRight,
} from "@tabler/icons-react";
import { Fancybox } from "@fancyapps/ui";

import classes from "./Gallery.module.css";

export function GalleryDetailPage() {
  const { v1, v2 } = useParams<{ v1: any; v2: any }>();
  const icon = <IconInfoCircle />;
  const [LoadingData, setLoadingData] = useState(false);
  const [Data, setData] = useState<any[]>([]);

  const LoadData = (v1: string) => {
    setLoadingData(true);
    axios
      .post(Api + "Activity/postShowactivity/", {
        act_id: v1,
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          setData(data);
        }
        setLoadingData(false);
      });
  };

  const formatDateThai = (dateStr: string) => {
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

  const truncateText = (text: string, length: number) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const items = [
    { title: "ภาพกิจกรรม", href: "/gallery" },
    {
      title: <>{truncateText(v2, 15)}</>,
      href: "",
    },
  ].map((item, index) => (
    <Anchor key={index} component={Nl} to={item.href}>
      {item.title}
    </Anchor>
  ));

  useEffect(() => {
    LoadData(v1);
    window.scrollTo(0, 0);
  }, [v1]);

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {});
    return () => {
      Fancybox.destroy();
    };
  }, [Data]);

  return (
    <Container size={"1200px"}>
      {LoadingData ? (
        <Paper radius={8} shadow="sm" p={10}>
          <Skeleton height={20} width="50%" mb={20} ml={20} />

          <Skeleton height={40} width="70%" mb={10} ml={20} />
          <Skeleton height={20} width="60%" mb={30} ml={20} />

          <Grid gutter="md" mt={50} mb={50}>
            {Array.from({ length: Data.length }).map((_, index) => (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={index}>
                <Card shadow="sm" withBorder>
                  <Card.Section
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Skeleton height={200} width="100%" />
                  </Card.Section>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      ) : (
        <>
          <Breadcrumbs
            separatorMargin={"xs"}
            ml={20}
            mb={20}
            separator={<IconChevronRight stroke={1} />}
          >
            {items}
          </Breadcrumbs>
          {Data.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.act_detail === item.act_detail)
          ).map((i) => (
            <Blockquote
              cite={
                <Group gap={2}>
                  <IconCalendarMonth size={20} />
                  {formatDateThai(i.act_date)}
                </Group>
              }
              icon={icon}
              key={i.act_id}
            >
              <Text size={"25px"}> {v2} </Text>
              <Text mt={15}>{i.act_detail}</Text>
            </Blockquote>
          ))}

          <Grid gutter="md" mt={50} mb={50}>
            {Data.map((i, key) => (
              <Grid.Col span={{ base: 6, md: 6, lg: 3 }} key={key}>
                <Card shadow="sm" withBorder>
                  <Card.Section
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <a href={Api + i.gal_pic} data-fancybox="gallery">
                      <Image src={Api + i.gal_pic} className={classes.image} />
                    </a>
                  </Card.Section>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}
