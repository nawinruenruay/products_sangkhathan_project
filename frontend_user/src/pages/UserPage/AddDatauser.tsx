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

interface Items {
  value: string;
  label: string;
}

// อีเมล
export function AddEmail({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "กรุณากรอกอีเมลที่ถูกต้อง",
    },
  });

  const FetchData = () => {
    axios
      .post(Api + "/User/Showuser", {
        userid: atob(id),
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          form.setValues({
            email: data[0].email,
          });
        }
      });
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
    FetchData();
  }, []);

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
  const [LoadingSubmit, setLoadingSubmit] = useState(false);

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
        } else if (value.length > 10) {
          return "กรุณากรอกหมายเลขโทรศัพท์ที่ถูกต้อง";
        }
        return null;
      },
    },
  });

  const FetchData = () => {
    axios
      .post(Api + "/User/Showuser", {
        userid: atob(id),
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          form.setValues({
            phone: data[0].phone,
          });
        }
      });
  };

  const Submit = (v: any) => {
    setLoadingSubmit(true);
    axios
      .post(Api + "User/Updatedata", {
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

  useEffect(() => {
    FetchData();
  }, []);

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

// วันเกิด
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

  const FetchData = () => {
    axios
      .post(Api + "/User/Showuser", {
        userid: atob(id),
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          const b = data[0].birthday;
          setBD_day(b.split("-")[2]);
          const bm1 = b.split("-")[1].split(0)[1];
          const bm2 = b.split("-")[1].split(0)[0];
          setBD_month(bm1 !== undefined ? bm1 : bm2);
          setBD_year((parseInt(b.split("-")[0]) + 543).toString());
        }
      });
  };

  const Submit = () => {
    setLoadingSubmit(true);
    if (!BD_day || !BD_month || !BD_year) {
      Notifications.show({
        title: "เพิ่มวันเกิดไม่สำเร็จ",
        message: "กรุณาเลือกวันเกิดที่ถูกต้อง",
        autoClose: 2000,
        color: "red",
        icon: <IconAlertCircle />,
      });
      setLoadingSubmit(false);
      return;
    } else {
      axios
        .post(Api + "User/Updatedata", {
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
    FetchData();
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

// ที่อยู่
export function AddAddress({ closeWithSuccess, close }: AddItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "กรุณากรอกอีเมลที่ถูกต้อง",
    },
  });

  const [Province, setProvince] = useState<Items[]>([]);
  const [Amphure, setAmphure] = useState<Items[]>([]);
  const [Tambon, setTambon] = useState<Items[]>([]);
  const [Zipcode, setZipcode] = useState<Items[]>([]);

  //จังหวัด
  const FetchProvince = () => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data.map((i: any) => ({
            value: i.id.toString(),
            label: i.name_th,
          }));
          setProvince(data);
        }
      });
  };

  // อำเภอ
  const FetchAmphure = (v: string) => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data
            .filter((i: any) => i.province_id.toString() === v)
            .map((i: any) => ({
              value: i.id.toString(),
              label: i.name_th,
            }));
          setAmphure(data);
        }
      });
  };

  //ตำบล
  const FetchTambon = (v: string) => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data
            .filter((i: any) => i.amphure_id.toString() === v)
            .map((i: any) => ({
              value: i.id.toString(),
              label: i.name_th,
            }));
          setTambon(data);
        }
      });
  };

  // รหัสไปรษณีย์
  const Fetchzipcode = (v: string) => {
    axios
      .get(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json"
      )
      .then((res) => {
        if (res.data.length !== 0) {
          const data = res.data
            .filter((i: any) => i.id.toString() === v)
            .map((i: any) => ({
              value: i.zip_code.toString(),
              label: i.zip_code.toString(),
            }));
          setZipcode(data);
        }
      });
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
    FetchProvince();
  }, []);

  return (
    <>
      <form
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <Select
          clearable
          withAsterisk
          allowDeselect={false}
          data={Province}
          label="จังหวัด"
          onChange={(v) => {
            if (v) {
              FetchAmphure(v);
            }
          }}
          searchable
        />
        <Select
          clearable
          withAsterisk
          allowDeselect={false}
          data={Amphure}
          onChange={(v) => {
            if (v) {
              FetchTambon(v);
              Fetchzipcode(v);
            }
          }}
          label="เขต/อำเภอ"
          searchable
        />
        <Select
          clearable
          withAsterisk
          allowDeselect={false}
          data={Tambon}
          onChange={(v) => {
            if (v) {
              Fetchzipcode(v);
            }
          }}
          label="แขวง/ตำบล"
          searchable
        />
        <Select
          clearable
          withAsterisk
          allowDeselect={false}
          data={Zipcode}
          label="รหัสไปรษณีย์"
          searchable
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
