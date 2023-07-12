export default {
  isRequestProxy: true,
  development: {
    host: 'http://localhost:5001',
    // host: 'http://chener.xyz:5001',
    cdn: '',
    wshost: 'ws://localhost:5001/v1/user/ws/web/connect'
  },
  test: {
    host: '',
    cdn: '',
  },
  release: {
    host: 'http://chener.xyz:5001',
    cdn: '',
    wshost: 'ws://chener.xyz:5001/v1/user/ws/web/connect'
  },
  site: {
    host: '',
    cdn: '',
  },
};
