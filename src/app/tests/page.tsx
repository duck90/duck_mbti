"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Box,
  Stack,
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { getTestList } from "@/services/test";
import { ITest } from "@/interface/test";

export default function TestPage() {
  const [list, setList] = useState<ITest[]>([]);
  const { data } = useSWR("get/tests", getTestList);

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setList(data.data);
    }
  }, [data]);

  return (
    <Stack direction={"row"}>
      {list.map((item: ITest) => (
        <Box key={item.id} sx={styles.testContainer}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography sx={styles.subTitle} color="text.secondary">
                {item.subtitle}
              </Typography>
              <Typography variant="body2">{item.description}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small">
                <Link href={`/tests/${item.id}`}>테스트 ≫</Link>
              </Button>
            </CardActions>
          </Card>
        </Box>
      ))}
    </Stack>
  );
}

const styles = {
  testContainer: {
    width: 275,
    height: 100,
    m: 2,
  },
  testWrapper: {
    border: "1px solid white",
    m: 1,
    p: 1,
    minWidth: 100,
    minHeight: 150,
    borderRadius: 5,
    cursor: "pointer",
  },
  subTitle: {
    mb: 1.5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
