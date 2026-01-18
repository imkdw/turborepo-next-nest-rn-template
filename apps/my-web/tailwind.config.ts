import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import { tailwindPreset } from '@repo/ui/tailwind-preset';

const config: Config = {
  presets: [tailwindPreset as Config],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [typography],
};

export default config;
