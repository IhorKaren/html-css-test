import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { styled } from "@mui/material/styles";
import { useLanguage } from "../contexts/LanguageContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.background.paper}`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0.8,
  },
}));

const ResultCircle = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-flex",
  marginBottom: theme.spacing(4),
  "&::after": {
    content: '""',
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    background: `radial-gradient(circle, ${theme.palette.primary.main}20, transparent 70%)`,
    filter: "blur(15px)",
    zIndex: -1,
  },
}));

const Results = ({ answers, totalQuestions, onRestart }) => {
  const { t } = useLanguage();
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const percentage = (correctAnswers / totalQuestions) * 100;

  const getResultMessage = () => {
    if (percentage === 100) return t.resultMessages.perfect;
    if (percentage >= 80) return t.resultMessages.good;
    if (percentage >= 60) return t.resultMessages.average;
    return t.resultMessages.poor;
  };

  const getResultColor = () => {
    if (percentage >= 80) return "success.main";
    if (percentage >= 60) return "warning.main";
    return "error.main";
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6, mb: 4 }}>
        <StyledPaper>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 600,
              mb: 4,
              background: `linear-gradient(135deg, ${(theme) =>
                theme.palette.primary.main}, ${(theme) =>
                theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 8px rgba(45, 212, 191, 0.3))",
            }}
          >
            {t.testResults}
          </Typography>

          <Box sx={{ textAlign: "center", mb: 6 }}>
            <ResultCircle>
              <CircularProgress
                variant="determinate"
                value={percentage}
                size={160}
                thickness={4}
                sx={{
                  color: getResultColor(),
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                    filter: "drop-shadow(0 0 8px rgba(45, 212, 191, 0.4))",
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  color={getResultColor()}
                  sx={{
                    fontWeight: "bold",
                    filter: "drop-shadow(0 0 4px rgba(45, 212, 191, 0.4))",
                  }}
                >
                  {Math.round(percentage)}%
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  {t.result}
                </Typography>
              </Box>
            </ResultCircle>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: "text.primary",
                mb: 2,
              }}
            >
              {t.correctAnswers} {correctAnswers} {t.outOf} {totalQuestions}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "text.secondary",
                fontSize: "1.1rem",
              }}
            >
              {getResultMessage()}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 500,
              color: "text.primary",
              borderBottom: "1px solid",
              borderColor: "divider",
              pb: 2,
            }}
          >
            {t.detailedReview}
          </Typography>

          <List
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {answers.map((answer, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    py: 2.5,
                    px: 3,
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      bgcolor: "rgba(45, 212, 191, 0.05)",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {answer.isCorrect ? (
                          <CheckCircleOutlineIcon
                            color="success"
                            sx={{
                              fontSize: 28,
                              filter:
                                "drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))",
                            }}
                          />
                        ) : (
                          <CancelOutlinedIcon
                            color="error"
                            sx={{
                              fontSize: 28,
                              filter:
                                "drop-shadow(0 0 4px rgba(239, 68, 68, 0.4))",
                            }}
                          />
                        )}
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                          }}
                        >
                          {answer.question}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{
                            display: "block",
                            mt: 1,
                            ml: 4.5,
                            color: answer.isCorrect
                              ? "success.main"
                              : "error.main",
                            fontWeight: 500,
                          }}
                        >
                          {t.yourAnswer}{" "}
                          {Array.isArray(answer.selectedAnswer)
                            ? answer.selectedAnswer.join(", ")
                            : answer.selectedAnswer}
                        </Typography>
                        {!answer.isCorrect && (
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              display: "block",
                              mt: 1,
                              ml: 4.5,
                              color: "success.main",
                              fontWeight: 500,
                            }}
                          >
                            {t.correctAnswer}{" "}
                            {Array.isArray(answer.correctAnswers)
                              ? answer.correctAnswers.join(", ")
                              : answer.correctAnswers}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < answers.length - 1 && (
                  <Divider
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={onRestart}
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
              }}
            >
              {t.tryAgain}
            </Button>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Results;
