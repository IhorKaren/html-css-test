import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Checkbox,
  FormGroup,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLanguage } from "../contexts/LanguageContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.background.paper}`,
  transition: "all 0.3s ease",
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

const StyledFormControlLabel = styled(FormControlLabel)(
  ({ theme, isSelected, isCorrect, showCorrect }) => ({
    marginBottom: theme.spacing(1.5),
    width: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.background.default}`,
    transition: "all 0.3s ease",
    backgroundColor: isSelected
      ? showCorrect
        ? isCorrect
          ? "rgba(16, 185, 129, 0.1)"
          : "rgba(239, 68, 68, 0.1)"
        : "rgba(45, 212, 191, 0.05)"
      : theme.palette.background.default,
    "&:hover": {
      backgroundColor: isSelected
        ? showCorrect
          ? isCorrect
            ? "rgba(16, 185, 129, 0.15)"
            : "rgba(239, 68, 68, 0.15)"
          : "rgba(45, 212, 191, 0.08)"
        : "rgba(45, 212, 191, 0.05)",
      border: `1px solid ${
        isSelected && showCorrect
          ? isCorrect
            ? theme.palette.success.main
            : theme.palette.error.main
          : theme.palette.primary.main
      }`,
    },
    "& .MuiTypography-root": {
      fontWeight: isSelected ? 500 : 400,
      color:
        isSelected && showCorrect && !isCorrect
          ? theme.palette.error.main
          : theme.palette.text.primary,
    },
  })
);

const StyledControl = styled(({ isMultiple, ...props }) =>
  isMultiple ? <Checkbox {...props} /> : <Radio {...props} />
)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    fontSize: 24,
  },
  "&.Mui-checked": {
    "& .MuiSvgIcon-root": {
      filter: "drop-shadow(0 0 4px rgba(45, 212, 191, 0.4))",
    },
  },
}));

const Question = ({ question, onAnswer, isAnswered, selectedAnswer }) => {
  const { t } = useLanguage();
  const [tempSelection, setTempSelection] = useState(
    Array.isArray(selectedAnswer)
      ? selectedAnswer
      : selectedAnswer
      ? [selectedAnswer]
      : []
  );

  const isMultipleChoice = question.correct_answers.length > 1;

  const handleChange = (event) => {
    if (!isAnswered) {
      const value = event.target.value;
      if (isMultipleChoice) {
        setTempSelection((prev) => {
          const newSelection = prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value];
          // Обмежуємо кількість вибраних відповідей
          return newSelection.length <= question.correct_answers.length
            ? newSelection
            : prev;
        });
      } else {
        setTempSelection([value]);
      }
    }
  };

  const handleConfirm = () => {
    if (tempSelection.length > 0 && !isAnswered) {
      if (
        isMultipleChoice &&
        tempSelection.length !== question.correct_answers.length
      ) {
        return; // Не дозволяємо підтвердити якщо кількість відповідей неправильна
      }
      onAnswer(isMultipleChoice ? tempSelection : tempSelection[0]);
    }
  };

  const isCorrectAnswer = (option) => {
    return question.correct_answers.includes(option);
  };

  const Control = isMultipleChoice ? FormGroup : RadioGroup;

  return (
    <StyledPaper>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1.2rem",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {question.question}
        </Typography>
        {isMultipleChoice && (
          <Chip
            label={t.severalAnswers}
            color="primary"
            size="small"
            sx={{
              backgroundColor: "rgba(45, 212, 191, 0.1)",
              color: "primary.main",
              fontWeight: 500,
              mt: 0.5,
            }}
          />
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <Control
            value={isMultipleChoice ? undefined : tempSelection[0] || ""}
            onChange={handleChange}
          >
            {question.options.map((option, index) => (
              <StyledFormControlLabel
                key={index}
                value={option}
                control={
                  <StyledControl
                    isMultiple={isMultipleChoice}
                    checked={tempSelection.includes(option)}
                    sx={{
                      color:
                        isAnswered && isCorrectAnswer(option)
                          ? "success.main"
                          : isAnswered &&
                            tempSelection.includes(option) &&
                            !isCorrectAnswer(option)
                          ? "error.main"
                          : "primary.main",
                    }}
                  />
                }
                label={option}
                disabled={isAnswered}
                isSelected={tempSelection.includes(option)}
                isCorrect={isCorrectAnswer(option)}
                showCorrect={isAnswered}
              />
            ))}
          </Control>
        </FormControl>

        {!isAnswered && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              disabled={
                tempSelection.length === 0 ||
                (isMultipleChoice &&
                  tempSelection.length !== question.correct_answers.length)
              }
              onClick={handleConfirm}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{
                px: 4,
                py: 1.5,
                background: `linear-gradient(45deg, ${(theme) =>
                  theme.palette.primary.main}, ${(theme) =>
                  theme.palette.secondary.main})`,
                fontSize: "1rem",
                fontWeight: 600,
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
              {t.confirmAnswer}
            </Button>
          </Box>
        )}
      </Box>
    </StyledPaper>
  );
};

export default Question;
