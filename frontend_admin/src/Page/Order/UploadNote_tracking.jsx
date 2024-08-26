import {
  Button,
  FileButton,
  Flex,
  Group,
  Image,
  NumberInput,
  Select,
  SimpleGrid,
  TextInput,
  Textarea,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications, notifications } from "@mantine/notifications";
import { IconDeviceFloppy } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TT from "../../Api";
import Swal from "sweetalert2";

function UploadNote_tracking({ close }) {
  //// if not img ===  public/uploadimg/Defualt/noimage.png
  const resetRef = useRef();
  const form = useForm({
    initialValues: {
      img: null,
      note_tracking: "",
    },
    validate: {},
  });

  const [File, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
  );

  const handleFileChange = (files) => {
    setFile(files);
    form.setValues({
      img: files,
    });
    // const file = files[0];
    if (files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(files);
    } else {
      setFile(null);
      form.setValues({
        img: null,
      });
      setSelectedImage(
        "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
      );
    }
  };

  const clearFile = () => {
    setFile(null);
    form.setValues({
      img: null,
    });
    setSelectedImage(
      "http://localhost/apisangkhathan/public/uploadimg/noimage.png"
    );
    resetRef.current?.();
  };

  useEffect(() => {
    // FetchFisicalYear();
    // FetchStatus();
    // FetchType();
    // FetchDate();
    // FetchAgen();
    // FetchMoney();
    // FetchRoom();
  }, []);

  const [LoadingSubmit, setLoadingSubmit] = useState(false);

  const Submit = (val) => {
    setLoadingSubmit(true);

    if (val.img === null) {
      Notifications.show({
        title: "กรุณาเพิ่มรูปภาพการถวายสังฆทาน",
        autoClose: 1000,
        color: "red",
      });
      setLoadingSubmit(false);
      return;
    }
    const Update = new FormData();
    Update.append("file", val.img);
    Update.append("typeimg", "add");
    axios.post(TT + "Order/UploadIMG", Update).then((res) => {
      const ress = res.data;
      if (ress[0].message === "success") {
        setLoadingSubmit(false);
        Swal.fire({
          icon: "success",
          title: "อัพโหลดหลักฐานการส่งสินค้าหรือรูปภาพการถวายสังฆทานเรียบร้อย",
          timer: 1500,
          timerProgressBar: true,
          allowOutsideClick: false,
          showConfirmButton: false,
        }).then((reees) => {
          close();
        });
      }
    });
  };

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <form
        style={{ fontWeight: 400 }}
        onSubmit={form.onSubmit((value) => {
          Submit(value);
        })}
      >
        <Flex mah={300} justify={"space-between"} direction={"column"} pt={10}>
          <label style={{ fontSize: "14px", fontWeight: "500" }}>
            รูปภาพการถวายสังฆทาน
          </label>
          {selectedImage && <Image w={150} src={selectedImage} mb={10} />}
          <Group justify={"flex-start"}>
            <FileButton
              fw={400}
              resetRef={resetRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button variant="light" color="violet" {...props}>
                  เลือกรูปภาพ
                </Button>
              )}
            </FileButton>
            <Button
              variant="subtle"
              fw={400}
              disabled={!File}
              color="red"
              onClick={clearFile}
            >
              รีเซ็ต
            </Button>
          </Group>
          <TextInput
            withAsterisk
            label="เลขพัสดุ (Tracking)"
            placeholder="เลขพัสดุ (Tracking)"
            {...form.getInputProps("note_tracking")}
          />
        </Flex>
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

export default UploadNote_tracking;
