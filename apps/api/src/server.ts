import { createApp } from '@/app';
import { validateEnv } from '@/config/env';

validateEnv();

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(port, () => {
  console.log(`[api] Health Portal API listening on http://localhost:${port}`);
});