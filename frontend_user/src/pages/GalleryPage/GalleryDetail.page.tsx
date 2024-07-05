import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Image,
  Container,
  Text,
  Skeleton,
  Paper,
  Flex,
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
import { useDocumentTitle } from "@mantine/hooks";

import classes from "./Gallery.module.css";

export function GalleryDetailPage() {
  const { v1, v2 } = useParams<{ v1: any; v2: any }>();
  const icon = <IconInfoCircle />;
  const [LoadingData, setLoadingData] = useState(false);
  const [Data, setData] = useState([]);
  useDocumentTitle(v2);

  const LoadData = (v1: any) => {
    setLoadingData(true);
    axios
      .post(Api + "Activity/postShowactivity/", {
        act_id: atob(v1),
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          setData(data);
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
    <>
      <Container size={"1200px"}>
        {LoadingData === true ? (
          <>
            <Paper radius={8} shadow="sm" p={10}>
              <Flex direction={"column"} gap={10} mb={20}>
                <Skeleton w={"100%"} h={300} />
              </Flex>
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
            <Breadcrumbs
              separatorMargin={"xs"}
              ml={20}
              mb={20}
              separator={<IconChevronRight stroke={1} />}
            >
              {items}
            </Breadcrumbs>
            {Data.filter(
              (item: any, index, self) =>
                index ===
                self.findIndex((t: any) => t.act_detail === item.act_detail)
            ).map((i: any) => (
              <Blockquote
                cite={
                  <>
                    <Group gap={2}>
                      <IconCalendarMonth size={20} />
                      {formatDateThai(i.act_date)}
                    </Group>
                  </>
                }
                icon={icon}
                key={i.act_id}
              >
                <Text size={"25px"}> {v2} </Text>
                <Text mt={15}>{i.act_detail}</Text>
              </Blockquote>
            ))}

            <Grid gutter="md" mt={50} mb={50}>
              {Data.map((i: any, key) => (
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={key}>
                  <Card shadow="sm" withBorder>
                    <Card.Section
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <a href={Api + i.gal_pic} data-fancybox="gallery">
                        <Image
                          src={Api + i.gal_pic}
                          className={classes.image}
                        />
                      </a>
                    </Card.Section>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
