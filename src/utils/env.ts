export const getIsDevelopment = () => {
  return process.env.NODE_ENV === 'DEVELOPMENT';
};

export const getIsStaging = () => {
  return process.env.NODE_ENV === 'STAGING';
};

export function getEnv() {
  if (getIsDevelopment()) {
    return 'development';
  }
  if (getIsStaging()) {
    return 'staging';
  }

  return 'production';
}
