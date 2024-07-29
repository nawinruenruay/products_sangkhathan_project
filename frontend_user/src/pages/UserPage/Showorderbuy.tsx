import { Flex, Image, Text } from "@mantine/core";
import axios from "axios";
import { useState, useEffect } from "react";
import { Api } from "../../Api";
import { DataTable } from "mantine-datatable";

interface ItemsProps {
  order: any;
}

export function Showorderbuy({ order }: ItemsProps) {
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [Data, setData] = useState<any[]>([]);
  const [LoadingData, setLoadingData] = useState(false);
  const totalAmount = Data.reduce((sum: any, i: any) => sum + i.total, 0);

  const FetchData = () => {
    setLoadingData(true);
    axios
      .post(Api + "/User/Showorderbuydetail", {
        userid: atob(id),
        order_id: order,
      })
      .then((res) => {
        const data = res.data;
        if (data.length !== 0) {
          setLoadingData(false);
          const configData = data.map((i: any, key: any) => ({
            ...i,
            id: key + 1,
          }));
          setData(configData);
        }
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <DataTable
        styles={{
          header: {
            height: "50px",
          },
        }}
        idAccessor="id"
        minHeight={350}
        fetching={LoadingData}
        loaderType="dots"
        highlightOnHover
        columns={[
          {
            accessor: "id",
            title: "ลำดับ",
            textAlign: "center",
          },
          {
            accessor: "name",
            title: "รายการ",
            render: ({ pname, img }) => (
              <>
                <Flex align={"center"}>
                  <Image src={Api + img} w={45} />
                  <Text ml={15}>{pname}</Text>
                </Flex>
              </>
            ),
          },
          {
            accessor: "qty",
            title: "จำนวน",
            textAlign: "center",
            render: ({ qty }) => (
              <>
                <Text>{qty} ชิ้น</Text>
              </>
            ),
          },
          {
            accessor: "price",
            title: "ราคา (บาท)",
            textAlign: "center",
            render: ({ total }) => (
              <>
                <Text>{total.toLocaleString()}</Text>
              </>
            ),
          },
        ]}
        records={Data}
      />
      <Flex justify={"right"} p={25}>
        <Text
          fz={"h3"}
          variant="gradient"
          gradient={{ from: "teal", to: "lime", deg: 90 }}
          fw={"bold"}
        >
          ราคารวม {totalAmount.toLocaleString()} บาท
        </Text>
      </Flex>
    </>
  );
}
