import React from "react";

const InputForm = ({ url, setUrl, loading, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="flex gap-2 mx-auto max-w-2xl w-full">
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="문제 URL을 입력하세요"
      className={`flex-1 min-w-0 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(20,40%,60%)] focus:border-transparent ${
        loading
          ? "opacity-50 cursor-not-allowed border-[hsl(20,30%,85%)]"
          : "border-[hsl(20,30%,80%)]"
      }`}
      disabled={loading}
      required
    />
    <button
      type="submit"
      className={`px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(20,40%,60%)] focus:ring-offset-2 transition-colors duration-200 ${
        loading
          ? "bg-[hsl(20,40%,75%)] cursor-not-allowed"
          : "bg-[hsl(20,40%,50%)] hover:bg-[hsl(20,40%,45%)]"
      } text-white`}
      disabled={loading}
    >
      {loading ? "분석중..." : "분석하기"}
    </button>
  </form>
);

export default InputForm;
