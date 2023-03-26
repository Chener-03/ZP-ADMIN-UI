import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';

export default [
  {
    url: '/test',
    method: 'get',
    response: () => ({
      code: 0,
      data: {
        ...Mock.mock({}),
      },
    }),
  },
] as MockMethod[];
