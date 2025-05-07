import fs from 'fs';
import fsPromises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

const fileContent = 'File content';
const pathToFile = '/path/to/file';
const joinMock = jest.fn();

jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: (...args: string[]) => joinMock(...args),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutMock = jest.fn();
    jest.spyOn(global, 'setTimeout').mockImplementation(setTimeoutMock);
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    expect(setTimeoutMock).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setIntervalMock = jest.fn();
    jest.spyOn(global, 'setInterval').mockImplementation(setIntervalMock);
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByInterval(callback, timeout);

    expect(setIntervalMock).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 50;
    const callbackTimes = 5;

    doStuffByInterval(callback, timeout);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout * callbackTimes);

    expect(callback).toHaveBeenCalledTimes(callbackTimes);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(pathToFile);

    expect(joinMock).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();

    jest.restoreAllMocks();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(fileContent);

    const content = await readFileAsynchronously(pathToFile);

    expect(content).toBe(fileContent);
  });
});
