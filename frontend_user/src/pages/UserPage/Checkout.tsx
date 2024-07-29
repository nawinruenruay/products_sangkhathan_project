import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";

import {
  Text,
  Flex,
  Button,
  LoadingOverlay,
  Image,
  Select,
  SimpleGrid,
  FileButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconCash } from "@tabler/icons-react";
import Swal from "sweetalert2";

interface ItemsProps {
  closeWithSuccess: () => void;
  order_id: any;
}

type FormValues = {
  img: string;
  img_file: File | null;
  img_preview: any | ArrayBuffer | null;
};

export function Checkout({ closeWithSuccess, order_id }: ItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [Loadingdata, setLoadingdata] = useState(false);
  const [LoadingSubmit, setLoadingSubmit] = useState(false);
  const [Day, setDay] = useState<any[]>([]);
  const [Month, setMonth] = useState<any[]>([]);
  const [Year, setYear] = useState<any[]>([]);
  const [Data, setData] = useState<any[]>([]);
  const totalAmount = Data.reduce((sum: any, i: any) => sum + i.total, 0);

  const form = useForm<FormValues>({
    initialValues: {
      img: "",
      img_file: null,
      img_preview: null,
    },
    validate: {},
  });

  const FetchDate = () => {
    ///วันที่///
    const day = [];
    for (let i = 1; i <= 31; i++) {
      let v = i < 10 ? "0" + i : i.toString();
      day.push({
        value: v,
        label: v,
      });
    }
    setDay(day);

    ///เดือน///
    const month = [
      {
        value: "1",
        label: "มกราคม",
      },
      {
        value: "2",
        label: "กุมภาพันธ์",
      },
      {
        value: "3",
        label: "มีนาคม",
      },
      {
        value: "4",
        label: "เมษายน",
      },
      {
        value: "5",
        label: "พฤษภาคม",
      },
      {
        value: "6",
        label: "มิถุนายน",
      },
      {
        value: "7",
        label: "กรกฎาคม",
      },
      {
        value: "8",
        label: "สิงหาคม",
      },
      {
        value: "9",
        label: "กันยายน",
      },
      {
        value: "10",
        label: "ตุลาคม",
      },
      {
        value: "11",
        label: "พฤศจิกายน",
      },
      {
        value: "12",
        label: "ธันวาคม",
      },
    ];
    setMonth(month);
    ///ปี///
    const year = [];
    const yearNow = new Date().getFullYear() + 543;
    for (let k = 0; k < 60; k++) {
      year.push({
        value: (yearNow - k).toString(),
        label: (yearNow - k).toString(),
      });
    }
    setYear(year);

    // ชั่วโมง
    const hour = [];
    for (let h = 0; h < 24; h++) {
      let v = h < 10 ? "0" + h : h.toString();
      hour.push({
        value: v,
        label: v,
      });
    }
    setHour(hour);

    // นาที
    const minute = [];
    for (let m = 0; m < 60; m++) {
      let v = m < 10 ? "0" + m : m.toString();
      minute.push({
        value: v,
        label: v,
      });
    }
    setMinute(minute);
  };
  const [Hour, setHour] = useState<any[]>([]);
  const [Minute, setMinute] = useState<any[]>([]);

  const Fetchdata = () => {
    setLoadingdata(true);
    axios
      .post(Api + "User/Showorderbuydetail/", {
        userid: atob(id),
        order_id: order_id,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.length !== 0) {
          // form.setValues({
          //   email: data[0].email,
          // });
          setData(data);
        }
        setLoadingdata(false);
      });
  };

  const handleFileChange = (files: any) => {
    form.setValues({
      img_file: null,
      img_preview: null,
    });
    if (files) {
      form.setValues({
        img_file: files,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValues({
          img_preview: reader.result,
        });
      };
      reader.readAsDataURL(files);
    }
  };

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    axios
      .post(Api + "User/Updatedata", {
        userid: atob(id),
        email: v.email,
        typeadd: "email",
      })
      .then((res) => {
        if (res.data === 200) {
          setLoadingSubmit(false);
          closeWithSuccess();
        }
      });
  };

  useEffect(() => {
    Fetchdata();
    FetchDate();
  }, []);

  return (
    <>
      <form
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <LoadingOverlay
          visible={Loadingdata}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ type: "dots" }}
        />
        <Image
          src={
            form.values.img_preview === null
              ? Api + "/public/uploadimg/noimage.png"
              : form.values.img_preview
          }
          // w={200}
          // h={500}
          mb={10}
        />
        <FileButton onChange={handleFileChange} accept="image/png,image/jpeg">
          {(props) => (
            <Button variant="outline" {...props} w={"100%"}>
              แนบหลักฐานการโอนเงิน
            </Button>
          )}
        </FileButton>
        <Text c={"#999999"} fz={"14px"}>
          ขนาดไฟล์: สูงสุด 1 MB ไฟล์ที่รองรับ: JPEG,JPG,PNG
        </Text>
        <Text fz={"h3"}>
          ยอดเงินที่ต้องชำระ {totalAmount.toLocaleString()} บาท
        </Text>
        <SimpleGrid cols={3}>
          <Select
            allowDeselect={false}
            label="วัน"
            data={Day}
            searchable
            clearable
            withAsterisk
          />
          <Select
            allowDeselect={false}
            label="เดือน"
            data={Month}
            searchable
            clearable
            withAsterisk
          />
          <Select
            allowDeselect={false}
            label="ปี"
            data={Year}
            searchable
            clearable
            withAsterisk
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Select
            allowDeselect={false}
            label="ชั่วโมง"
            data={Hour}
            searchable
            clearable
            withAsterisk
          />
          <Select
            allowDeselect={false}
            label="นาที"
            data={Minute}
            searchable
            clearable
            withAsterisk
          />
        </SimpleGrid>
        <Flex pt={10} justify={"flex-start"} gap={5} pos={"relative"}>
          <Button
            loading={LoadingSubmit}
            loaderProps={{ type: "dots" }}
            type="submit"
            fw={400}
            color="green"
            leftSection={<IconCash />}
            w={"100%"}
          >
            ชำระเงิน
          </Button>
        </Flex>
      </form>
    </>
  );
}
