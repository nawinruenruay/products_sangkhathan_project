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
  Tooltip,
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
import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";
import clsx from "clsx";
import classes from "./User.module.css";
import { useUser } from "../../components/UserContext";

type DateOptions = {
  year: "numeric" | "2-digit";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day: "numeric" | "2-digit";
};

interface Items {
  id: any;
  order_id: any;
  order_date: any;
  status: any;
}

export function Purchase() {
  const nav = useNavigate();
  const { FetchUser } = useUser();
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingProfile, setLoadingProfile] = useState(false);
  const [Expanded, setExpanded] = useState<any[]>([]);
  const [Table, setTable] = useState<any[]>([]);
  const [ExpandedData, setExpandedData] = useState<{ [key: string]: any[] }>(
    {}
  );

  const LoadDatatable = async () => {
    setLoadingProfile(true);
    if (id) {
      try {
        const ordersResponse = await axios.post(Api + "User/Showorderbuy/", {
          userid: atob(id),
        });
        const ordersData = ordersResponse.data;

        if (ordersData.length !== 0) {
          const ordersWithId = ordersData.map((i: any, key: any) => ({
            ...i,
            id: key + 1,
          }));
          setTable(ordersWithId);

          const detailsPromises = ordersWithId.map((order: any) =>
            axios.post(Api + "/User/Showorderbuydetail", {
              userid: atob(id),
              order_id: order.order_id,
            })
          );
          const detailsResponses = await Promise.all(detailsPromises);

          const detailsData = detailsResponses.reduce(
            (acc: any, res: any, index: number) => {
              const order_id = ordersWithId[index].order_id;
              acc[order_id] = res.data.map((item: any, key: any) => ({
                ...item,
                id: key + 1,
              }));
              return acc;
            },
            {}
          );
          setExpandedData(detailsData);
        }
      } catch (err) {
        console.error("error", err);
      }
      setLoadingProfile(false);
    }
  };

  const options2: DateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const CancelOrder = (order_id: any) => {
    Swal.fire({
      title: "คุณต้องการยกเลิกออเดอร์?",
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#40C057",
      cancelButtonText: "ยกเลิก",
      cancelButtonColor: "red",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(Api + "Buy/CancelOrder", {
            order_id: order_id,
          })
          .then((res) => {
            if (res.data === 200) {
              Notifications.show({
                title: "ยกเลิกออเดอร์สำเร็จ",
                message: "คุณได้ยกเลิกออเดอร์เรียบร้อยแล้ว",
                autoClose: 2000,
                color: "green",
                icon: <IconCheck />,
              });
              LoadDatatable();
            }
          });
      }
    });
  };

  const Checkoutt = async (order_id: any) => {
    const data = await FetchUser(id);
    const userData = data.data.data[0];
    if (userData.address === "") {
      Swal.fire({
        title: "คุณยังไม่ได้กรอกที่อยู่?",
        text: "กรุณากรอกที่อยู่ก่อนทำการชำระเงิน!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#40C057",
      }).then((result) => {
        if (result.isConfirmed) {
          nav("/user/account/?v=address");
        }
      });
    } else {
      nav("/checkout", { state: { order_id } });
    }
  };

  useEffect(() => {
    if (id) {
      LoadDatatable();
    } else {
      nav("/login");
    }
    window.scrollTo(0, 0);
  }, [id, nav]);

  const PAGE_SIZES = [5, 10, 15];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [record, setRecord] = useState<Items[]>([]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecord(
      Table.slice(from, to).map((i: any, key: any) => ({
        ...i,
        id: from + key + 1,
      }))
    );
  }, [page, pageSize, Table]);

  return (
    <>
      <Paper shadow="sm" py={25} mih={400} pos={"relative"}>
        <LoadingOverlay
          visible={LoadingProfile}
          zIndex={100}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ type: "dots" }}
        />
        <Group justify={"space-between"} px={30}>
          <Text size={"lg"} fw={"bold"}>
            การซื้อของฉัน
          </Text>
        </Group>
        <Divider mt="md" />
        <Box>
          <DataTable
            styles={{
              header: {
                height: "50px",
              },
            }}
            minHeight={300}
            idAccessor="order_id"
            loaderType="dots"
            highlightOnHover
            columns={[
              {
                accessor: "x",
                title: "",
                render: ({ order_id }) => (
                  <>
                    <Tooltip label="ดูรายการที่สั่งซื้อ">
                      <IconChevronRight
                        className={clsx(classes.expandIcon, {
                          [classes.expandIconRotated]:
                            Expanded.includes(order_id),
                        })}
                        stroke={1}
                      />
                    </Tooltip>
                  </>
                ),
              },
              {
                accessor: "order_date",
                textAlign: "center",
                title: "วันที่สั่งซื้อ",
                render: ({ order_date }) => (
                  <>
                    {new Date(order_date).toLocaleDateString("TH-th", options2)}
                  </>
                ),
              },
              {
                accessor: "order_id",
                textAlign: "center",
                title: "เลขที่การสั่งซื้อ",
                render: ({ order_id }) => <>{order_id}</>,
              },
              {
                accessor: "status",
                textAlign: "center",
                title: "สถานะ",
                width: 200,
                render: ({ status }) => (
                  <>
                    <Flex align={"center"} justify={"center"}>
                      {status == 1 ? (
                        <Badge color="yellow" size="lg" variant="light">
                          รอการชำระเงิน
                        </Badge>
                      ) : status == 2 ? (
                        <Badge color="yellow" size="lg" variant="light">
                          รอตรวจสอบการชำระเงิน
                        </Badge>
                      ) : status == 3 ? (
                        <Badge color="green" size="lg" variant="light">
                          ชำระเงินเรียบร้อยแล้ว
                        </Badge>
                      ) : status == 5 ? (
                        <Badge color="red" size="lg" variant="light">
                          ยกเลิกการสั่งซื้อ
                        </Badge>
                      ) : (
                        <Badge color="black" size="lg" variant="light">
                          test123
                        </Badge>
                      )}
                    </Flex>
                  </>
                ),
              },
              {
                accessor: "xx",
                textAlign: "center",
                title: "จัดการ",
                render: ({ status, order_id }) => (
                  <Flex
                    align={"center"}
                    justify={"center"}
                    gap={5}
                    wrap={"wrap"}
                  >
                    {status == 1 ? (
                      <>
                        <Button
                          h={30}
                          variant="outline"
                          leftSection={<IconCash />}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            Checkoutt(order_id);
                          }}
                        >
                          ชำระเงิน
                        </Button>
                        <Button
                          h={30}
                          variant="outline"
                          color="red"
                          leftSection={<IconX />}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            CancelOrder(order_id);
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </>
                    ) : status == 2 ? (
                      <></>
                    ) : status == 3 ? (
                      <></>
                    ) : status == 5 ? (
                      <></>
                    ) : (
                      <></>
                    )}
                  </Flex>
                ),
              },
            ]}
            totalRecords={Table.length}
            recordsPerPage={pageSize}
            page={page}
            records={record}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            paginationText={({ from, to, totalRecords }) =>
              `แสดง ${from} ถึง ${to} ของ ${totalRecords} รายการ`
            }
            recordsPerPageLabel="แสดงรายการ"
            noRecordsText="ไม่พบรายการสินค้า"
            noRecordsIcon={
              <Box p={4} mb={4} className={classes.noRecordsBox}>
                <IconMoodSad size={36} strokeWidth={1.5} />
              </Box>
            }
            rowExpansion={{
              allowMultiple: false,
              expanded: {
                recordIds: Expanded,
                onRecordIdsChange: setExpanded,
              },
              content: ({ record }) => {
                const order_id = record.order_id;
                const details = ExpandedData[order_id] || [];
                return (
                  <DataTable
                    striped
                    columns={[
                      {
                        accessor: "name",
                        title: "รายการ",
                        render: ({ pname, img }) => (
                          <Group ml={30}>
                            <Image src={Api + img} w={30} />
                            <Text>{pname}</Text>
                          </Group>
                        ),
                      },
                      {
                        accessor: "qty",
                        title: "จำนวน (ชิ้น)",
                        textAlign: "center",
                        render: ({ qty }) => <Box component="span">{qty}</Box>,
                      },
                      {
                        accessor: "price",
                        title: "ราคา (บาท)",
                        textAlign: "center",
                        render: ({ total }) => (
                          <Box component="span">{total.toLocaleString()}</Box>
                        ),
                      },
                    ]}
                    records={details}
                  />
                );
              },
            }}
          />
        </Box>
      </Paper>
    </>
  );
}
