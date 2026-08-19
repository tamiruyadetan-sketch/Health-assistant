const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5',
};

export function validateEnv(): void {
  const { port } = env;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT env value: "${process.env.PORT}". Expected an integer between 1 and 65535.`);
  }
  if (env.nodeEnv === 'production' && env.corsOrigin === '*') {
    throw new Error('CORS_ORIGIN must be set to an explicit allowlist in production.');
  }
}

export default env;