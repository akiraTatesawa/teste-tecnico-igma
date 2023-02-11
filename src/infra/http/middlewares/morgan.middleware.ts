import morgan, { StreamOptions } from "morgan";
import { WinstonLogger } from "../logger/logger";

const stream: StreamOptions = {
  write: (message) => WinstonLogger.create().http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

export const morganMiddleware = morgan(
  ":method :url :status :response-time ms - :res[content-length]",
  {
    stream,
    skip,
  }
);
