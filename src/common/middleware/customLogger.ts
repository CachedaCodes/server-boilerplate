import { Writable } from "node:stream";
import TelegramBot from "node-telegram-bot-api";
import type { Logger, LoggerOptions } from "pino";
import { levels, pino } from "pino";
import { env } from "@/common/utils/envConfig";

class LogInterceptor extends Writable {
  private readonly telegraBot: TelegramBot;

  constructor(private readonly outputStream = process.stdout) {
    super();
    if (!env.TELEGRAM_LOGGING_BOT_TOKEN) {
      throw new Error("TELEGRAM_LOGGING_BOT_TOKEN is not defined");
    }
    this.telegraBot = new TelegramBot(env.TELEGRAM_LOGGING_BOT_TOKEN, { polling: false });
  }

  _write(chunk: any, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    // Parse the JSON log object
    const logObject = JSON.parse(chunk.toString());

    // Extract the message and level
    const message = logObject.msg;
    if (!message) return;
    const level = logObject.level ? levels.labels[logObject.level].toUpperCase() : "UNKNOWN";

    // Log the intercepted message
    if (logObject.logTelegram) {
      this.telegraBot.sendMessage(env.TELEGRAM_LOGGING_CHAT_ID, `${level} (${logObject.name}): ${message}`);
    }

    // Forward to the original output stream
    this.outputStream.write(chunk);
    callback();
  }
}

export const createTelegramLogger = (options?: LoggerOptions): Logger => {
  if (env.isProduction) {
    return pino({ ...options }, new LogInterceptor());
  }

  return pino({ ...options });
};

export const logger = createTelegramLogger({ name: "ServerBoilerplate", base: { pid: null } });
