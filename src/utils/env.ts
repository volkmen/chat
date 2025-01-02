import path from 'node:path';

export const getIsDevelopment = () => {
  return process.env.NODE_ENV === 'DEVELOPMENT';
};

export function getEnvVariablesPath() {
  function getEnvFileName() {
    switch (process.env.NODE_ENV) {
      case 'DEVELOPMENT':
        return 'development.env';
      case 'STAGING':
        return 'staging.env';
      default:
        return 'production.env';
    }
  }
  return path.resolve(process.cwd(), 'src', 'envs', getEnvFileName());
}
