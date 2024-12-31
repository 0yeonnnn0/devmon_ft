import axios from "axios";

export const fetchExplanation = async (url) => {
  const response = await axios.post(
    "http://localhost:8080/crawl",
    { url },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};
