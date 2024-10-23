/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export const Configure = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Make sure this path includes all your component files
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
