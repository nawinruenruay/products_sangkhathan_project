import { useEffect, useRef } from "react";
import { Image, Text, Paper } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import banner from "../../assets/img/banner-about.png";
import classes from "./About.module.css";
import { useDocumentTitle } from "@mantine/hooks";

export function AboutPage() {
  useDocumentTitle("ประวัติ | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
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

      <Text mt={30} mb={50}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque tempora,
        ipsa, culpa iusto vitae velit provident aperiam saepe iste, dolores
        officia maxime veniam inventore veritatis exercitationem. Hic officia
        harum sint vitae. Distinctio molestias minima, necessitatibus natus
        incidunt ullam voluptatem quod itaque porro earum, quae, rerum eos
        suscipit officiis deserunt reiciendis nam. A impedit reprehenderit
        veniam eius perferendis illum repellat optio odio incidunt aspernatur
        ullam rem tempora itaque repellendus rerum nemo id, dolores maxime
        beatae expedita! Molestiae numquam optio aperiam officia nesciunt
        assumenda debitis repellendus, nulla mollitia aut et. Eum necessitatibus
        perspiciatis maiores at vero amet optio odit laborum, molestiae maxime.
      </Text>
    </>
  );
}
