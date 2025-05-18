import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  LinearProgress,
  Paper,
} from "@mui/material";
import Question from "./Question";
import Results from "./Results";
import { useLanguage } from "../contexts/LanguageContext";

const Quiz = ({ questions }) => {
  const { t, language } = useLanguage();
  const [answers, setAnswers] = useState(
    new Array(questions.length).fill(null)
  );
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (questionIndex, selectedAnswer) => {
    const newAnswers = [...answers];
    const currentQuestion = questions[questionIndex];
    const correctAnswers = currentQuestion.correct_answers[language];

    const isCorrect = Array.isArray(selectedAnswer)
      ? selectedAnswer.length === correctAnswers.length &&
        selectedAnswer.every((answer) => correctAnswers.includes(answer)) &&
        correctAnswers.every((answer) => selectedAnswer.includes(answer))
      : correctAnswers.includes(selectedAnswer);

    newAnswers[questionIndex] = {
      question: currentQuestion.question[language],
      selectedAnswer,
      isCorrect,
      correctAnswers: correctAnswers,
    };
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.every((answer) => answer !== null)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setAnswers(new Array(questions.length).fill(null));
    setIsFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progress =
    (answers.filter((answer) => answer !== null).length / questions.length) *
    100;

  if (isFinished) {
    return (
      <Results
        answers={answers}
        totalQuestions={questions.length}
        onRestart={restartQuiz}
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: "background.default",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
          pt: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: -1,
          },
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{t.progress}</span>
            <span style={{ color: "primary.main", fontWeight: 600 }}>
              {Math.round(progress)}%
            </span>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(45, 212, 191, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${(theme) =>
                  theme.palette.primary.main}, ${(theme) =>
                  theme.palette.secondary.main})`,
              },
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="md">
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{
              fontWeight: "bold",
              mb: 1,
              background: `linear-gradient(135deg, ${(theme) =>
                theme.palette.primary.main}, ${(theme) =>
                theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(45, 212, 191, 0.3))",
            }}
          >
            {t.title}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              mb: 6,
              color: "text.secondary",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            {t.description}
          </Typography>

          {questions.map((question, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  color: "text.secondary",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&::before": {
                    content: '""',
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: answers[index]
                      ? "primary.main"
                      : "text.disabled",
                  },
                }}
              >
                {t.question} {index + 1} {t.of} {questions.length}
              </Typography>
              <Question
                question={{
                  ...question,
                  question: question.question[language],
                  options: question.options[language],
                  correct_answers: question.correct_answers[language],
                }}
                onAnswer={(selectedAnswer) =>
                  handleAnswer(index, selectedAnswer)
                }
                isAnswered={answers[index] !== null}
                selectedAnswer={answers[index]?.selectedAnswer}
              />
            </Box>
          ))}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!answers.every((answer) => answer !== null)}
              sx={{
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: `linear-gradient(45deg, ${(theme) =>
                  theme.palette.primary.main}, ${(theme) =>
                  theme.palette.secondary.main})`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${(theme) =>
                    theme.palette.primary.dark}, ${(theme) =>
                    theme.palette.secondary.dark})`,
                },
                "&.Mui-disabled": {
                  background: "rgba(255, 255, 255, 0.12)",
                },
              }}
            >
              {t.finishTest}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Quiz;
