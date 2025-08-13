export const getApiBaseUrl = () => {
  const url = process.env.REACT_APP_API_URL || 'http://localhost:8081';
  if (process.env.NODE_ENV === 'production' && !url.startsWith('https://')) {
    throw new Error('API base URL must use HTTPS in production');
  }
  return url;
};
