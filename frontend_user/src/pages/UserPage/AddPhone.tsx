import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { Api } from "../../Api";

interface AddItemsProps {
  closeWithSuccess: () => void;
  close: () => void;
}

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
