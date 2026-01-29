export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
    };

    this.logs.push(entry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    const levelName = LogLevel[level];
    const timestamp = entry.timestamp.toISOString();
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] [${levelName}] ${message}`, data || '');
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}] [${levelName}] ${message}`, data || '');
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}] [${levelName}] ${message}`, data || '');
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}] [${levelName}] ${message}`, data || '');
        break;
    }
  }

  debug(message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: unknown) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: unknown) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: unknown) {
    this.log(LogLevel.ERROR, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();