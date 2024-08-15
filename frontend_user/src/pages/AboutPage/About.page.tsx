import { useEffect } from "react";
import { Image, Text, Paper, Flex } from "@mantine/core";
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
        <Image src={banner} radius={8} />
      </Paper>

      <Flex direction="column" gap={5} mt="lg">
        <Text>
          <Text ml={20} component="span" fw={700}>
            ชมรมผู้สูงอายุ ศูนย์ร่มโพธิ์ร่มไทร วัยดอกลำดวน{" "}
          </Text>
          มีประวัติการก่อตั้งกลุ่ม ก่อตั้งมาได้ 12 ปี เริ่มขึ้นเมื่อปี พ.ศ. 2554
          จนถึงปัจจุบัน เข้าสู่ปีที่ 13 เดิมมีสมาชิกทั้ง 70 คน
          แต่ด้วยสถานการณ์โควิดจึงทำให้มีจำนวนสมาชิกลดลงในปี 2564 มีจำนวน 60 คน
          อาชีพส่วนใหญ่เป็นเกษตรกรจึงทำให้มีเวลาว่างผู้สูงอายุบางราย
          สมาชิกบางคนมีเรื่องเครียดบ้าง
          เหงาบ้างจึงมารวมตัวกันทำกิจกรรมกลุ่มและสร้างอาชีพให้กับตนเองให้มีรายได้เสริมเพิ่มขึ้น
          ได้ทำกิจกรรมบำบัด สร้างเสริมทักษะและการดูแลตัวเอง
          ปัจจุบันมีสมาชิกชมรมมีทั้งสิ้น 30 คน โดยก่อตั้งที่แรก ณ
          องค์การบริการส่วนตำบลนครชุม ในช่วง 7 – 8 ปีแรก
          และทำการย้ายสถานที่มาตั้งอยู่วัดทุ่งเศรษฐี จนถึงปัจจุบัน
          และกำหนดทำกิจกรรมร่วมกันในชมรมทุกวันศุกร์ เวลา 08.00 น. – 15.00 น.
        </Text>

        <Text>
          <Text ml={20} component="span" fw={700}>
            รายชื่อผู้ก่อตั้ง{" "}
          </Text>
          ประธานชมรมคนที่หนึ่ง คือ แม่ส่ง , ประธานชมรมคนที่สอง คือ แม่สำลี,
          รองประธานชมรมคนแรก คือ พ่อแพง , พ่อแนน หัวหน้าชมรม คือ คุณชฎาพร
          ทองธรรมชาติ
        </Text>

        <Text>
          <Text ml={20} component="span" fw={700}>
            ความหมายของชื่อศูนย์{" "}
          </Text>
          ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวนมีที่มาจากดอกลำดวนซึ่งเป็นสัญลักษณ์ของผู้สูงอายุที่มีสีผมคล้ายดอกลำดวนและเป็นร่มโพธิ์ร่มไทรของลูกหลานมีอายุยืนยาวตามความหมายของดอกลำดวน
          การได้รับรางวัล ได้รับรางวัลพระปกเกล้าเจ้าอยู่หัวในปีพ.ศ. 2564
        </Text>

        <Text>
          <Text ml={20} component="span" fw={700}>
            การได้รับรางวัล{" "}
          </Text>
          ได้รับรางวัลพระปกเกล้าเจ้าอยู่หัวในปีพ.ศ. 2564
        </Text>
      </Flex>
    </>
  );
}
