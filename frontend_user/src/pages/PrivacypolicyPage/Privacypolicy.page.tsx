import { useEffect } from "react";
import { useDocumentTitle } from "@mantine/hooks";
import { List, Text, Paper } from "@mantine/core";

export function PrivacypolicyPage() {
  useDocumentTitle("นโยบายความเป็นส่วนตัว | ศูนย์ร่มโพธิ์ร่มไทรวัยดอกลำดวน");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <div>Hello World</div>;
}
