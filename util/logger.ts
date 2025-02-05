import { logger, consoleTransport } from "react-native-logs";

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "info",
  transport: consoleTransport,
  transportOptions: {
    colors: {
      debug: "blueBright" as const,
      info: "greenBright" as const,
      warn: "yellowBright" as const,
      error: "redBright" as const
    }
  },
  async: process.env.NODE_ENV !== 'test',
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
};

const log = logger.createLogger<typeof consoleTransport, "debug" | "info" | "error" | "warn">(defaultConfig);

export default log; 