import path from 'node:path';

export const getIsDevelopment = () => {
  return process.env.NODE_ENV === 'DEVELOPMENT';
};

export const getIsStaging = () => {
  return process.env.NODE_ENV === 'STAGING';
};
export const getIsTesting = () => {
  return process.env.NODE_ENV === 'TESTING';
};

export function getEnv() {
  if (getIsDevelopment()) {
    return 'development';
  }
  if (getIsStaging()) {
    return 'staging';
  }
  if (getIsTesting()) {
    return 'testing';
  }

  return 'production';
}
