import { Button, Flex, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";

interface AddItemsProps {
  closeWithSuccess: () => void;
  close: () => void;
}

export function AddPhone({ closeWithSuccess, close }: AddItemsProps) {
  const form = useForm({
    initialValues: {
      id_course: "",
      id_term: "",
    },
    validate: {
      id_term: (val) => (val.length === 0 ? "กรุณาเลือกเทอม/ปีการศึกษา" : null),
      id_course: (val) => (val.length === 0 ? "กรุณาเลือกรายวิชา" : null),
    },
  });

  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const Submit = (v: any) => {
    setLoadingSubmit(true);

    const Add = new FormData();

    axios.post(Api + "/Addcourseplaninmajorteml", Add).then((res) => {
      if (res.data === "200") {
        setLoadingSubmit(false);
        closeWithSuccess();
      }
    });
  };

  return (
    <>
      <form
        style={{ fontWeight: 400 }}
        onSubmit={form.onSubmit((v: any) => {
          Submit(v);
        })}
      >
        <Text>Test</Text>
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
