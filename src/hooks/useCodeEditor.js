export const useCodeEditor = () => {
  const [showCode, setShowCode] = useState(false);

  const toggleCodeView = () => setShowCode(!showCode);

  return { showCode, toggleCodeView };
};
