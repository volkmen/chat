declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SMTP_HOST: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      SMTP_PORT: string;
      PWD: string;
    }
  }
}
