import { logger, consoleTransport, transportFunctionType } from "react-native-logs";
import * as Sentry from 'sentry-expo';

type TransportProps = Parameters<typeof consoleTransport>[0];

const defaultConfig = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "info",
  transport: (props: TransportProps) => {
    // Send errors to Sentry in production
    if (props.level.text === 'error' && !__DEV__) {
      Sentry.Native.captureException(props.msg);
    }
    consoleTransport(props);
  },
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