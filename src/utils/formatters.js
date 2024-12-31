export const formatExplanation = (text) => {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return "유효하지 않은 텍스트입니다.";
  }
  return text.replace(/(?<!\d)\.(?!\d)/g, ".\n\n").trim();
};

export const removeBackticks = (code) => {
  return code.replace(/```python\n|```/g, "");
};
