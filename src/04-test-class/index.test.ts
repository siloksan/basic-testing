import lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(50).getBalance()).toBe(50);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const ballance = 50;
    const account = getBankAccount(ballance);

    expect(() => account.withdraw(100)).toThrow(
      new InsufficientFundsError(ballance),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const ballance = 50;
    const transferAmount = 100;
    const sourceAccount = getBankAccount(ballance);
    const destinationAccount = getBankAccount(0);

    expect(() =>
      sourceAccount.transfer(transferAmount, destinationAccount),
    ).toThrow(new InsufficientFundsError(ballance));
  });

  test('should throw error when transferring to the same account', () => {
    const ballance = 50;
    const transferAmount = 100;
    const account = getBankAccount(ballance);

    expect(() => account.transfer(transferAmount, account)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const ballance = 50;
    const amount = 10;
    const account = getBankAccount(ballance);
    const result = ballance + amount;

    account.deposit(amount);

    expect(result).toBe(account.getBalance());
  });

  test('should withdraw money', () => {
    const ballance = 50;
    const amount = 10;
    const account = getBankAccount(ballance);
    const result = ballance - amount;

    account.withdraw(amount);

    expect(result).toBe(account.getBalance());
  });

  test('should transfer money', () => {
    const sourceBallance = 50;
    const destinationBallance = 60;
    const transferAmount = 10;
    const sourceAccount = getBankAccount(sourceBallance);
    const destinationAccount = getBankAccount(destinationBallance);
    const newSourceBallance = sourceBallance - transferAmount;
    const newDestinationBallance = destinationBallance + transferAmount;

    sourceAccount.transfer(transferAmount, destinationAccount);

    expect(newSourceBallance).toBe(sourceAccount.getBalance());
    expect(newDestinationBallance).toBe(destinationAccount.getBalance());
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(1);

    const account = getBankAccount(50);
    const balance = await account.fetchBalance();

    expect(typeof balance).toBe('number');
    jest.restoreAllMocks();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBallance = 50;
    jest
      .spyOn(lodash, 'random')
      .mockImplementationOnce(() => newBallance)
      .mockImplementationOnce(() => 1);

    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(newBallance);

    jest.restoreAllMocks();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(0);

    const account = getBankAccount(50);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      new SynchronizationFailedError(),
    );

    jest.restoreAllMocks();
  });
});
