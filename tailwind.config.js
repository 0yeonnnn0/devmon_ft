/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 디렉토리의 모든 파일에서 Tailwind 사용
  ],
  theme: {
    extend: {}, // 필요에 따라 사용자 정의 테마 설정
  },
  plugins: [], // 플러그인 추가 가능
};
