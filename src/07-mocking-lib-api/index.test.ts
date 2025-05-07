import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const DATA = { id: 1 };
const BASE_URL = 'https://jsonplaceholder.typicode.com';
const ENDPOINT = '/users/1';

jest.mock('lodash', () => ({
  throttle: (callback: () => void) => callback,
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const createMock = jest.spyOn(axios, 'create');

    await throttledGetDataFromApi(ENDPOINT);
    expect(createMock).toHaveBeenCalledWith({
      baseURL: BASE_URL,
    });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: DATA });

    axios.create = jest.fn().mockReturnValue({
      get: getMock,
    });
    await throttledGetDataFromApi(ENDPOINT);

    expect(getMock).toHaveBeenCalledWith(ENDPOINT);
  });

  test('should return response data', async () => {
    const getMock = jest.fn().mockResolvedValue({ data: DATA });
    axios.create = jest.fn().mockReturnValue({
      get: getMock,
    });
    const response = await throttledGetDataFromApi(ENDPOINT);

    expect(response).toEqual(DATA);
  });
});
