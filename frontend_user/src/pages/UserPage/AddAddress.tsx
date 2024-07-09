import { Button, Flex, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Api } from "../../Api";

interface AddItemsProps {
  closeWithSuccess: () => void;
  close: () => void;
}

interface Items {
  value: string;
  label: string;
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
