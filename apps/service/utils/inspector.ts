import { isEqual, isNil } from 'lodash';
import { ZodError } from 'zod';
import {
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// ----------

/**
 *
 * Class for managing inspection methods.
 *
 */
export class Inspector<T> {
  private data: InspectorDataType<T>;
  private options: inspectorOptions;

  constructor(data: InspectorDataType<T>, options?: inspectorOptions) {
    this.data = data;
    this.options = { ...options };
  }

  static createValidationError(path: string[], message: string) {
    return new HttpException('Validation Error', HttpStatus.BAD_REQUEST, {
      cause: new ZodError([{ code: 'custom', path, message }]),
    });
  }

  /**
   * Ensures the input data matches the expected value or values.
   *
   * @example
   * const a = 'keyA';
   * await inspector(a).expect(['keyB', 'keyC'], () => new Error('a matched none of the expected keys')); // Throws an error
   *
   * const b = 'keyB';
   * await inspector(b).expect(['keyB', 'keyC'], () => new Error('b matched none of the expected keys')); // Returns 'keyB'
   */
  async expect<TExpect>(
    expectedValue:
      | TExpect
      | TExpect[]
      | ((data: T) => boolean)
      | ((data: T) => boolean)[],
    error: ErrorType = this.options.defaultError?.expect ??
      new BadRequestException(),
  ) {
    // To make sure data is not a promise
    const awaitedData = await this.data;

    // To make sure expectedValueArray is an array
    const expectedValueArray = Array.isArray(expectedValue)
      ? expectedValue
      : [expectedValue];

    // Get the state wether the data has matched to expected values
    const dataMatched = expectedValueArray.some((compare) => {
      if (compare instanceof Function) return compare(awaitedData);
      return isEqual(awaitedData, compare);
    });

    if (!dataMatched) throw typeof error === 'function' ? error() : error;
    return awaitedData as T;
  }

  /**
   * Ensures the input data is a non-nullable value.
   *
   * @example
   * const a = null;
   * await inspector(a).essential(Error, 'a is null'); // Throws an error
   *
   * const b = 100;
   * await inspector(b).essential(Error, 'b is null'); // Returns 100
   */
  async essential(
    error: ErrorType = this.options.defaultError?.essential ??
      new NotFoundException(),
  ) {
    return this.expect((value) => !isNil(value), error) as Promise<
      NonNullable<T>
    >;
  }
}

// ----- Helper Types -----

type InspectorDataType<T> = T | Promise<T>;

interface inspectorOptions {
  defaultError?: {
    expect?: ErrorType;
    essential?: ErrorType;
  };
}

type ErrorType = Error | (() => Error);
