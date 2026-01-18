import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@repo/ui/tailwind-preset';

const config: Config = {
  presets: [tailwindPreset as Config],
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
};

export default config;
