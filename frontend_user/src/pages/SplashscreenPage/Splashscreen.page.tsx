import { useNavigate } from "react-router-dom";
import { Image, Group } from "@mantine/core";
import screen from "../../assets/img/splashsreen.png";
import classes from "./Splashscreen.module.css";

export function SplashscreenPage() {
  const nav = useNavigate();

  return (
    <>
      <Image src={screen} />
      <Group justify={"center"} align={"center"} mt={40} gap={10}>
        <button
          className={classes.button_82_pushable}
          onClick={() => nav("product/p1")}
        >
          <span className={classes.button_82_shadow}></span>
          <span className={classes.button_82_edge}></span>
          <span className={classes.button_82_front}>สินค้าผลิตภัณฑ์</span>
        </button>

        <button
          className={classes.button_82_pushable}
          onClick={() => nav("product/p2")}
        >
          <span className={classes.button_82_shadow}></span>
          <span className={classes.button_82_edge}></span>
          <span className={classes.button_82_front}>สังฆทานออนไลน์</span>
        </button>
      </Group>
    </>
  );
}
