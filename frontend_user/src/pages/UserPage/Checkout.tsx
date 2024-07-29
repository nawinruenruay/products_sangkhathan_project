import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Text,
  Paper,
  Flex,
  Group,
  Button,
  Divider,
  LoadingOverlay,
  Badge,
  Box,
  Image,
} from "@mantine/core";

import { Notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconCheck,
  IconX,
  IconCash,
  IconMoodSad,
  IconChevronRight,
} from "@tabler/icons-react";

import Swal from "sweetalert2";

export function Checkout() {
  const { v } = useParams<{ v: any }>();
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [Loadingdata, setLoadingdata] = useState(false);

  const Fetchdata = () => {
    setLoadingdata(true);
    axios
      .post(Api + "User/Showorderbuydetail/", {
        userid: atob(id),
        order_id: v,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.length !== 0) {
        }
        setLoadingdata(false);
      });
  };

  useEffect(() => {
    if (v && id) {
      Fetchdata();
    }
  }, []);

  return (
    <>
      <Paper shadow="sm" py={25} mih={400} pos={"relative"}>
        {/* <LoadingOverlay
          visible={LoadingProfile}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ type: "dots" }}
        /> */}
        <Group justify={"space-between"} px={30}>
          <Text size={"lg"} fw={"bold"}>
            ชำระเงิน
          </Text>
        </Group>
        <Divider mt="md" />
        <Box></Box>
      </Paper>
    </>
  );
}
