import { getApiBaseUrl } from './api';

describe('getApiBaseUrl', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('returns provided URL', () => {
    process.env.REACT_APP_API_URL = 'https://example.com';
    expect(getApiBaseUrl()).toBe('https://example.com');
  });

  it('enforces https in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.REACT_APP_API_URL = 'http://insecure';
    expect(() => getApiBaseUrl()).toThrow();
  });
});
