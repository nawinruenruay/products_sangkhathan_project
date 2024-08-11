import { useEffect } from "react";
import { Image, Text, Paper } from "@mantine/core";
import banner from "../../assets/img/banner-about.png";
import { useDocumentTitle } from "@mantine/hooks";

export function AboutPage() {
  useDocumentTitle("ประวัติ | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Paper radius={8} shadow="sm">
        <Image src={banner} radius={8} h={350} />
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
