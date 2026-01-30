import { defineConfig } from "prisma";
import dotenv from "dotenv";

dotenv.config(); // optional if you need .env loaded in this environment

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});