import { useState } from "react";
import Cookies from "js-cookie";
import { Box, Group } from "@mantine/core";

export function AcceptPolicy() {
  const [isVisible, setIsVisible] = useState(!Cookies.get("acceptPolicy"));

  const handleAccept = () => {
    Cookies.set("acceptPolicy", "true", { expires: 365 });
    setIsVisible(false);
  };

  return (
    isVisible && (
      <Box
        pos={"fixed"}
        bottom={0}
        w={"100%"}
        bg={"#333"}
        c={"#fff"}
        p={"10px"}
      >
        <Group align={"center"} justify={"center"}>
          <p>
            เว็บไซต์ของเราใช้คุกกี้เพื่อเพิ่มประสิทธิภาพในการใช้งานเว็บไซต์{" "}
            <a
              href="/privacy-policy"
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              อ่านนโยบายข้อมูลส่วนบุคคล (PDPA) และ ข้อกำหนดในการให้บริการ
            </a>
          </p>
          <button
            onClick={handleAccept}
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            ยอมรับ
          </button>
        </Group>
      </Box>
    )
  );
}
