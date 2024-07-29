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
import { useNavigate } from "react-router-dom";
import {
  IconCheck,
  IconX,
  IconCash,
  IconMoodSad,
  IconChevronRight,
} from "@tabler/icons-react";

import Swal from "sweetalert2";
import clsx from "clsx";
import classes from "./User.module.css";

export function Checkout() {
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
