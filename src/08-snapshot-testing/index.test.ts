import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const elements = [1, 2, 3];

    const linkedListNode = {
      next: {
        next: {
          next: {
            next: null,
            value: null,
          },
          value: 3,
        },
        value: 2,
      },
      value: 1,
    };

    expect(generateLinkedList(elements)).toStrictEqual(linkedListNode);
  });

  test('should generate linked list from values 2', () => {
    const elements = [4, 5, 6];

    expect(generateLinkedList(elements)).toMatchSnapshot();
  });
});
