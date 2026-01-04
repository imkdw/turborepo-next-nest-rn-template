import TransportStream from 'winston-transport';

export interface LokiTransportOptions extends TransportStream.TransportStreamOptions {
  host: string;
  app: string;
  basicAuth: {
    username: string;
    token: string;
  };
}

interface LokiBody {
  streams: {
    stream: Record<string, unknown>;
    values: [string, string][];
  }[];
}

interface WinstonLogInfo {
  level: string;
  message: string;
  timestamp?: string;
  context?: string;
  [key: string]: unknown;
}

export class LokiTransport extends TransportStream {
  private readonly opts: LokiTransportOptions;
  private readonly LOKI_MAX_BODY_SIZE = 100_000;

  constructor(opts: LokiTransportOptions) {
    super(opts);
    this.opts = opts;
  }

  log(info: WinstonLogInfo, callback: () => void): void {
    setImmediate(() => {
      (this as TransportStream).emit('logged', info);
    });

    this.sendToLoki(info)
      .catch(error => {
        console.error('Loki logging failed', error);
      })
      .finally(() => {
        callback();
      });
  }

  private async sendToLoki(info: WinstonLogInfo): Promise<void> {
    const { host } = this.opts;
    const lokiBody = this.convertToLokiFormat(info);

    const response = await fetch(host, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.createAuthorization(),
      },
      body: JSON.stringify(lokiBody),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error('Loki logging failed', {
        status: response.status,
        statusText: response.statusText,
      });
    }
  }

  private convertToLokiFormat(info: WinstonLogInfo): LokiBody {
    const { level, message, context, ...rest } = info;

    const streamLabels: Record<string, unknown> = {
      app: this.opts.app,
      level,
      ...(context && { context }),
    };

    const logLine = {
      level,
      message,
      context,
      ...rest,
      timestamp: new Date().toISOString(),
    };

    let stringifiedLogLine = JSON.stringify(logLine, null, 2);
    if (stringifiedLogLine.length > this.LOKI_MAX_BODY_SIZE) {
      stringifiedLogLine = stringifiedLogLine.slice(0, this.LOKI_MAX_BODY_SIZE);
    }

    const timestampNano = BigInt(Date.now()) * 1000000n;

    return {
      streams: [
        {
          stream: streamLabels,
          values: [[String(timestampNano), stringifiedLogLine]],
        },
      ],
    };
  }

  private createAuthorization(): string {
    const credentials = `${this.opts.basicAuth.username}:${this.opts.basicAuth.token}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  }
}
