import { Button, Flex, TextInput, SimpleGrid, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy, IconAlertCircle } from "@tabler/icons-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Api } from "../../Api";
import { Notifications } from "@mantine/notifications";

interface AddItemsProps {
  closeWithSuccess: () => void;
  close: () => void;
}

// อีเมล
export function AddEmail({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "กรุณากรอกอีเมลที่ถูกต้อง",
    },
  });

  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    axios
      .post(Api + "User/Addemail_phone_birthday", {
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

  return (
    <>
      <form
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <TextInput
          label="อีเมล"
          placeholder="กรอกอีเมล"
          {...form.getInputProps("email")}
          withAsterisk
        />
        <Flex pt={10} justify={"flex-end"} gap={5}>
          <Button
            fw={400}
            color="red"
            variant="subtle"
            onClick={() => {
              close();
            }}
          >
            ยกเลิก
          </Button>
          <Button
            loading={LoadingSubmit}
            type="submit"
            fw={400}
            color="green"
            leftSection={<IconDeviceFloppy />}
          >
            บันทึก
          </Button>
        </Flex>
      </form>
    </>
  );
}

// หมายเลขโทรศัพท์
export function Addphone({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");

  const form = useForm({
    initialValues: {
      phone: "",
    },
    validate: {
      phone: (value: any) => {
        const isNumeric = /^\d+$/.test(value);
        if (!isNumeric) {
          return "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง";
        } else if (value.length < 10) {
          return "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง";
        }
        return null;
      },
    },
  });

  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    axios
      .post(Api + "User/Addemail_phone_birthday", {
        userid: atob(id),
        phone: v.phone,
        typeadd: "phone",
      })
      .then((res) => {
        if (res.data === 200) {
          setLoadingSubmit(false);
          closeWithSuccess();
        }
      });
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <TextInput
          label="หมายเลขโทรศัพท์"
          placeholder="กรอกหมายเลขโทรศัพท์"
          {...form.getInputProps("phone")}
          withAsterisk
        />
        <Flex pt={10} justify={"flex-end"} gap={5}>
          <Button
            fw={400}
            color="red"
            variant="subtle"
            onClick={() => {
              close();
            }}
          >
            ยกเลิก
          </Button>
          <Button
            loading={LoadingSubmit}
            type="submit"
            fw={400}
            color="green"
            leftSection={<IconDeviceFloppy />}
          >
            บันทึก
          </Button>
        </Flex>
      </form>
    </>
  );
}

// วัน/เดือน/ปี เกิด
export function AddBirthday({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [Day, setDay] = useState<any[]>([]);
  const [Month, setMonth] = useState<any[]>([]);
  const [Year, setYear] = useState<any[]>([]);
  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const [BD_day, setBD_day] = useState<any>("");
  const [BD_month, setBD_month] = useState<any>("");
  const [BD_year, setBD_year] = useState<any>("");

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
  };

  const Submit = () => {
    setLoadingSubmit(true);
    if (!BD_day || !BD_month || !BD_year) {
      Notifications.show({
        title: "เพิ่ม วัน/เดือน/ปี เกิด ไม่สำเร็จ",
        message: "กรุณาเลือก วัน/เดือน/ปี เกิด",
        autoClose: 2000,
        color: "red",
        icon: <IconAlertCircle />,
      });
      setLoadingSubmit(false);
      return;
    } else {
      axios
        .post(Api + "User/Addemail_phone_birthday", {
          userid: atob(id),
          birthday: BD_year - 543 + "-" + BD_month + "-" + BD_day,
          typeadd: "birthday",
        })
        .then((res) => {
          if (res.data === 200) {
            setLoadingSubmit(false);
            closeWithSuccess();
          }
        });
    }
  };

  useEffect(() => {
    FetchDate();
  }, []);

  return (
    <>
      <SimpleGrid cols={3}>
        <Select
          allowDeselect={false}
          onChange={setBD_day}
          value={BD_day}
          label="วัน"
          data={Day}
          searchable
          clearable
        />
        <Select
          allowDeselect={false}
          label="เดือน"
          onChange={setBD_month}
          value={BD_month}
          data={Month}
          searchable
          clearable
        />
        <Select
          allowDeselect={false}
          label="ปี"
          onChange={setBD_year}
          value={BD_year}
          data={Year}
          searchable
          clearable
        />
      </SimpleGrid>
      <Flex pt={10} justify={"flex-end"} gap={5}>
        <Button
          fw={400}
          color="red"
          variant="subtle"
          onClick={() => {
            close();
          }}
        >
          ยกเลิก
        </Button>
        <Button
          loading={LoadingSubmit}
          onClick={Submit}
          fw={400}
          color="green"
          leftSection={<IconDeviceFloppy />}
        >
          บันทึก
        </Button>
      </Flex>
    </>
  );
}
