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
  Modal,
  LoadingOverlay,
  Badge,
  Box,
} from "@mantine/core";

import { Notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconX, IconCash } from "@tabler/icons-react";

import { DataTable } from "mantine-datatable";
import Swal from "sweetalert2";

import { Showorderbuy } from "./Showorderbuy";

type DateOptions = {
  year: "numeric" | "2-digit";
  month: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day: "numeric" | "2-digit";
};

interface Items {
  order_id: any;
  order_date: any;
  status: any;
}

export function Purchase() {
  const nav = useNavigate();
  const { id } = JSON.parse(localStorage.getItem("dataUser") || "{}");
  const [LoadingProfile, setLoadingProfile] = useState(false);

  const [ModalShoworderbuy, setModalShoworderbuy] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [Table, setTable] = useState<any[]>([]);

  const LoadDatatable = () => {
    setLoadingProfile(true);
    if (id) {
      axios
        .post(Api + "User/Showorderbuy/", {
          userid: atob(id),
        })
        .then((res) => {
          const data = res.data;
          // console.log(data);
          if (data.length !== 0) {
            const configData = data.map((i: any, key: any) => ({
              ...i,
              id: key + 1,
            }));
            setTable(configData);
          }
          setLoadingProfile(false);
        });
    }
  };

  const options2: DateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const OpenModalShoworderbuy = (order_id: any) => {
    setSelectedOrderId(order_id);
    setModalShoworderbuy(true);
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

  const Checkout = (order_id: any) => {
    nav("/user/checkout/" + btoa(order_id));
  };

  useEffect(() => {
    if (id) {
      LoadDatatable();
    } else {
      nav("/login");
    }
    window.scrollTo(0, 0);
  }, []);

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
        <Divider my="md" />
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
                accessor: "id",
                title: "ลำดับ",
                textAlign: "center",
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
                accessor: "order",
                textAlign: "center",
                title: "รายการสินค้าที่สั่งซื้อ",
                render: ({ order_id }) => (
                  <>
                    <Button
                      h={30}
                      variant="outline"
                      radius="md"
                      color="blue"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        OpenModalShoworderbuy(order_id);
                      }}
                    >
                      คลิกเพื่อดูรายการสินค้าที่สั่งซื้อ
                    </Button>
                  </>
                ),
              },
              {
                accessor: "status",
                textAlign: "center",
                title: "สถานะ",
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
                  <Flex align={"center"} justify={"center"} gap={5}>
                    {status == 1 ? (
                      <>
                        <Button
                          h={30}
                          variant="outline"
                          leftSection={<IconCash />}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            Checkout(order_id);
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
            noRecordsText="ไม่พบรายการ"
          />
        </Box>
      </Paper>
      <Modal
        title="รายการสินค้าที่สั่งซื้อ"
        opened={ModalShoworderbuy}
        onClose={() => {
          setModalShoworderbuy(false);
          setSelectedOrderId(null);
        }}
        size={"lg"}
        centered
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Showorderbuy order={selectedOrderId} />
      </Modal>
    </>
  );
}
