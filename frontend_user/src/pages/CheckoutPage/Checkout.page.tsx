import axios from "axios";
import { useEffect, useState } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Paper,
  Flex,
  Button,
  Anchor,
  Box,
  Breadcrumbs,
  UnstyledButton,
  Tooltip,
  ActionIcon,
  TextInput,
} from "@mantine/core";
import { NavLink as Nl, useNavigate } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import {
  IconMoodSad,
  IconX,
  IconCheck,
  IconChevronRight,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";

// import classes from "./Checkout.module.css";

import { useCartsum } from "../../components/CartContext";

export function CheckoutPage() {
  // useDocumentTitle("ทำการสั่งซื้อ");
  const nav = useNavigate();
  const [LoadingData, setLoadingData] = useState(false);
  const [Data, setData] = useState<any[]>([]);
  const dataUser = JSON.parse(localStorage.getItem("dataUser") || "{}");

  const LoadData = (v: any) => {
    setLoadingData(true);
    if (v) {
      axios
        .post(Api + "Cart/Showcart/", {
          username: v,
        })
        .then((res) => {
          const data = res.data;
          console.log(data);
          if (data.length !== 0) {
            // setData(data);
          }
          setLoadingData(false);
        });
    }
  };

  useEffect(() => {
    if (!dataUser.username) {
      nav("/login");
    }
    LoadData(dataUser.username);
    window.scrollTo(0, 0);
  }, []);

  return <div>หน้าสั่งซื้อสินค้า</div>;
}
