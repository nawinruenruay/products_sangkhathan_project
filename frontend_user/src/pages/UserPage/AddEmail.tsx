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
      .post(Api + "User/Addemail", {
        userid: atob(id),
        email: v.email,
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
