"use client";

import { useState, useEffect } from "react";
import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Stack,
  Card,
  CardHeader,
  CardActions,
  CardMedia,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { getResultData } from "@/services/result";
import { IResult } from "@/interface/result";

export default function ResultPage({ params }: { params: { id: string } }) {
  const imageUrl = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL;
  const [data, setData] = useState<IResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getResult = async () => {
    setIsLoading(true);

    try {
      const result = await getResultData(Number(params.id));
      setData(result.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  if (isLoading || !data) return null;

  return (
    <Stack alignItems={"center"} justifyContent={"center"} sx={{ pt: 10 }}>
      <Card sx={{ width: 500 }}>
        <CardHeader
          title={data.test.title}
          subheader={data.test.subtitle}
          action={
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          }
        />
        <CardMedia
          component="img"
          height={500 * (data.height / data.width)}
          image={`${imageUrl}${data?.filename}`}
          alt="Paella dish"
        />
      </Card>
    </Stack>
  );

  // return (
  //
  //     <Typography variant="h4">{data.test.title}</Typography>
  //     <Typography variant="body1" sx={{ mt: 5 }}>
  //       {data.test.description}
  //     </Typography>

  //     <Stack alignItems={"center"} justifyContent={"center"} sx={{ mt: 10 }}>
  //       <Image
  //         src={`${imageUrl}${data?.filename}`}
  //         width={500}
  //         height={332}
  //         alt={data.filename}
  //       />
  //     </Stack>
  //   </Stack>
  // );
}

const styles = {
  testWrapper: {
    border: "1px solid white",
    m: 1,
    p: 1,
    minWidth: 100,
    minHeight: 150,
    borderRadius: 5,
    cursor: "pointer",
  },
};
