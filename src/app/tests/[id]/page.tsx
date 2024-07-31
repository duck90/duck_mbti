"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  LinearProgress,
  Button,
  IconButton,
} from "@mui/material";
import { cloneDeep } from "lodash";
import { getTestDetailInfo, postMbtiResult } from "@/services/test";
import { ITestQuestion } from "@/interface/test";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import useUser from "@/hooks/useUser";

const LEVEL_TYPE = [0, 1, 2, 3, 4];
// const LEVEL_TYPE = [
//   "젼혀 아니다",
//   "아니다",
//   "보통이다",
//   "그렇다",
//   "매우 그렇다",
// ];

export default function TestDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<ITestQuestion[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<null | boolean>(null);
  const [isFail, setIsFail] = useState(false);

  const { user } = useUser();

  const getDetailInfo = async () => {
    setIsLoading(true);
    try {
      const result = await getTestDetailInfo(Number(params.id));
      const testQuestions = result.data.questions;

      if (!!testQuestions) {
        const temp = Array(testQuestions.length).fill(-1);
        setQuestions(testQuestions);
        setChecked(temp);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkValidation = () => {
    let isValid = true;
    let nonChecked = -1;

    checked.forEach((item, i) => {
      if (item === -1) {
        isValid = false;
        nonChecked = i;
      }
    });

    if (!isValid) {
      setCurrentIndex(nonChecked);
    } else {
      getMbtiResult();
    }
  };

  const getMbtiResult = async () => {
    setIsLoading(true);

    try {
      const result: { id: number; result: number } = await postMbtiResult({
        id: Number(params.id),
        answer: checked,
      });

      router.push(`/results/${result.result}`);
    } catch (e) {
      setIsFail(true);
    }
  };

  const renderQuestion = (ques: ITestQuestion, index: number) => {
    switch (ques.type) {
      case "radio":
        return (
          <>
            {(ques.answer as []).map((item, ques_index) => {
              return (
                <Stack
                  key={ques_index}
                  alignItems={"center"}
                  justifyContent={"center"}
                  sx={{
                    ...styles.radioAnswerWrapper,
                    border: `2px solid ${
                      ques_index === checked[index] ? "#90caf9" : "white"
                    }`,
                  }}
                  onClick={() => {
                    const result = cloneDeep(checked);
                    result[currentIndex] = ques_index;

                    setChecked(result);

                    setCurrentIndex(currentIndex + 1);
                  }}
                >
                  <Typography variant="body2">{item}</Typography>
                </Stack>
              );
            })}
          </>
        );
      case "level":
        return (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            sx={styles.levelContiner}
          >
            {LEVEL_TYPE.map((item, ques_index) => {
              return (
                <Stack
                  key={ques_index}
                  alignItems={"center"}
                  justifyContent={"center"}
                  sx={styles.levelWrapper}
                  onClick={() => {
                    const result = cloneDeep(checked);
                    result[currentIndex] = ques_index;

                    setChecked(result);

                    setCurrentIndex(currentIndex + 1);
                  }}
                >
                  <Box sx={styles.radio}></Box>
                  {ques_index === checked[index] && (
                    <Box sx={styles.selectedRadio}></Box>
                  )}

                  <Typography>{item}</Typography>
                </Stack>
              );
            })}
          </Stack>
        );

      default:
        break;
    }
  };

  useEffect(() => {
    getDetailInfo();
  }, []);

  useEffect(() => {
    if (!!questions.length && currentIndex === questions.length) {
      checkValidation();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!!questions.length && currentIndex === questions.length) {
      return;
    }
    if (!!checked.length && checked.every((item) => item !== -1)) {
      getMbtiResult();
    }
  }, [checked]);

  useEffect(() => {
    if (isFail) {
      const temp = Array(questions.length).fill(-1);
      setChecked(temp);
      setCurrentIndex(0);
    }
  }, [isFail]);

  if (isLoading === null || isLoading === true) return null;

  if (isFail)
    return (
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        sx={styles.testDetailWrapper}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          결과를 가져오는데 실패했습니다.
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setIsFail(false)}
        >
          다시 테스트하기
        </Button>
      </Stack>
    );

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={styles.testDetailWrapper}
    >
      {questions.map((ques, i) => {
        return (
          <Box key={i}>
            {currentIndex === ques.order_no && (
              <Stack alignItems={"center"} justifyContent={"center"}>
                <Typography variant="h5">{ques.question}</Typography>
                {renderQuestion(ques, i)}
              </Stack>
            )}
          </Box>
        );
      })}
      <Box sx={styles.progressArea}>
        <Stack direction={"row"}>
          {currentIndex !== 0 && (
            <IconButton
              aria-label="prev-arrow"
              color="primary"
              size="small"
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              <ArrowLeftIcon sx={styles.arrowBtn} />
            </IconButton>
          )}
          <Box sx={styles.progressWrapper}>
            <LinearProgress
              variant="determinate"
              value={((currentIndex + 1) / questions.length) * 100}
              sx={styles.progessbar}
            />
          </Box>
          {currentIndex !== questions.length - 1 && (
            <IconButton
              aria-label="next-arrow"
              color="primary"
              size="small"
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              <ArrowRightIcon sx={styles.arrowBtn} />
            </IconButton>
          )}
        </Stack>
        <Stack alignItems={"center"} sx={{ mt: 2 }}>
          <Typography>{`${currentIndex + 1} / ${questions.length}`}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

const styles = {
  testDetailWrapper: {
    minHeight: "calc(100vh - 128px)",
  },
  radioAnswerWrapper: {
    borderRadius: 5,
    mt: 3,
    width: 500,
    height: 100,
    cursor: "pointer",
  },
  progressArea: {
    mt: 2,
  },

  progressWrapper: {
    width: 350,
    pt: 2.8,
  },
  checkedQuestionWrapper: {
    border: "1px solid blue",
  },
  arrowBtn: {
    fontSize: 50,
  },
  progessbar: {
    height: 15,
    borderRadius: 5,
  },
  levelContiner: {
    width: 500,
    mt: 4,
  },
  levelWrapper: {
    position: "relative",
    cursor: "pointer",
  },
  radio: {
    width: 30,
    height: 30,
    borderRadius: 10,
    border: "2px solid white",
    mx: 3,
    mb: 1,
  },
  selectedRadio: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 10,
    top: 5,
  },
};
