import { create } from "zustand";
const useExplanationStore = create((set) => ({
  explanation: null,
  tagName: "",
  relatedProblems: [],

  setExplanation: (data) => set({ explanation: data }),
  setTagName: (name) => set({ tagName: name }),
  setRelatedProblems: (problems) => set({ relatedProblems: problems }),

  reset: () =>
    set({
      explanation: null,
      tagName: "",
      relatedProblems: [],
    }),
}));

export default useExplanationStore;
