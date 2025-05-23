import dotenv from "dotenv";
import { url, cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  TELEGRAM_LOGGING_BOT_TOKEN: str({ devDefault: testOnly("") }),
  TELEGRAM_LOGGING_CHAT_ID: str({ devDefault: testOnly("") }),
  NOTION_AUTH_TOKEN: str({ devDefault: testOnly("") }),

  // Firebase Configuration
  FIREBASE_API_KEY: str({ devDefault: testOnly("") }),
  FIREBASE_AUTH_DOMAIN: str({ devDefault: testOnly("") }),
  FIREBASE_PROJECT_ID: str({ devDefault: testOnly("") }),
  FIREBASE_STORAGE_BUCKET: str({ devDefault: testOnly("") }),
  FIREBASE_MESSAGING_SENDER_ID: str({ devDefault: testOnly("") }),
  FIREBASE_APP_ID: str({ devDefault: testOnly("") }),
});
