import { useState } from "react";
import { fetchExplanation } from "../services/api";
import useExplanationStore from "../stores/explanationStore";

export const useAlgorithmSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setExplanation, setTagName, setRelatedProblems, reset } =
    useExplanationStore();

  const handleSubmit = async (url) => {
    reset();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchExplanation(url);
      setTagName(data.tag_name);
      setRelatedProblems(data.related_problem);
      setExplanation(JSON.parse(data.data));
    } catch (error) {
      setError(error.response?.data?.detail || "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleSubmit };
};
