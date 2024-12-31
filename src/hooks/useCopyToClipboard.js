export const useCopyToClipboard = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return { copySuccess, handleCopy };
};
