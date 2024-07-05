import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Api } from "../../Api";
import {
  Image,
  Text,
  Skeleton,
  Paper,
  Flex,
  Grid,
  Card,
  Group,
  Button,
  Badge,
  Modal,
  Tabs,
  rem,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { IconBrandProducthunt, IconUser } from "@tabler/icons-react";
import { useDocumentTitle } from "@mantine/hooks";

export function UserPage() {
  const nav = useNavigate();
  const { tabsValue } = useParams();
  const iconStyle = { width: rem(), height: rem(12) };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Tabs
        defaultValue="profile"
        value={tabsValue}
        onChange={(tabsValue) => nav(`/user/${tabsValue}`)}
        orientation="vertical"
        // mt={30}
        // mb={50}
      >
        <Tabs.List>
          <Tabs.Tab
            value="profile"
            leftSection={<IconUser style={iconStyle} />}
          >
            บัญชีของฉัน
          </Tabs.Tab>
          <Tabs.Tab
            value="purchase"
            // leftSection={<IconBrandProducthunt style={iconStyle} />}
          >
            การซื้อของฉัน
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Text>123</Text>
        </Tabs.Panel>

        <Tabs.Panel value="purchase">
          <Text>123</Text>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
