import { useEffect, useRef } from "react";
import { Image, Text, Paper, Grid, Group } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";

import banner from "../../assets/img/banner-contact.png";
import classes from "./Contact.module.css";

export function ContactPage() {
  const autoplay = useRef(Autoplay({ delay: 3000 }));

  useEffect(() => {
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
      <Grid gutter="md" mt={20}>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Paper radius={8} shadow="md" px={50} py={20} h={"100%"}>
            <Text ta={"center"} size={"20px"} mb={20}>
              ติดต่อเรา
            </Text>
            <Text mb={10}>มหาวิทยาลัยราชภัฏกำแพงเพชร</Text>
            <Text>69 หมู่ 1 ต.นครชุม อ.เมือง จ.กำแพงเพชร 62000</Text>
            <Text>โทรศัพท์ : 055-706-555</Text>
            <Text>โทรสาร : 055-706-518</Text>
            <Text>อีเมล : kpru@kpru.ac.th</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Paper radius={8} shadow="md" px={50} py={20} h={"100%"}>
            <Text ta={"center"} size={"20px"} mb={20}>
              โซเชียล
            </Text>
            <Text>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem
              suscipit vitae laboriosam nemo ad sed? Commodi non doloremque modi
              dolorem.
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
      <Group align={"center"} justify={"center"} mt={40} mb={50}>
        <Text size={"20px"}>แผนที่ตั้ง วัดทุ่งเศรษฐี</Text>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1798.6231218385876!2d99.495681!3d16.453564!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30de1903e4340b6d%3A0x234a6c879ce43cf3!2sWat%20Thung%20Setthi!5e1!3m2!1sen!2sth!4v1715934412099!5m2!1sen!2sth"
          width="100%"
          height="545"
        ></iframe>
      </Group>
    </>
  );
}
