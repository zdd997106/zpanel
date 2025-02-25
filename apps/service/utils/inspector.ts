import { isEqual, isNil } from 'lodash';
import { NotFoundException, BadRequestException } from '@nestjs/common';

/**
 *
 * Class for managing inspection methods.
 *
 */
export class Inspector<TData> {
  constructor(private readonly data: ResolvableData<TData>) {
    this.data = data;
  }

  /**
   * Ensures the input data matches the expected value or values.
   *
   * @example
   * new Inspector(data).expect(5).then((result) => {
   *   console.log('Data matches expected value:', result);
   * }).otherwise((error) => {
   *   console.error('Data does not match expected value:', error);
   * });
   */
  public expect<T extends Awaited<TData>>(
    expectedValue:
      | T
      | T[]
      | ((data: TData) => boolean)
      | ((data: TData) => boolean)[],
  ): Inspection<T> {
    return this.createInspection<T>(
      this.validate(expectedValue),
      () => new BadRequestException(),
    );
  }

  /**
   * Ensures the input data is a non-nullable value.
   *
   * @example
   * new Inspector(data).essential().then((result) => {
   *   console.log('Data is not null or undefined:', result);
   * }).otherwise((error) => {
   *   console.error('Data is null or undefined:', error);
   * });
   */
  public essential(): Inspection<NonNullable<Awaited<TData>>> {
    return this.expect<NonNullable<Awaited<TData>>>(
      (value) => !isNil(value),
    ).otherwise(() => new NotFoundException());
  }

  // --- PRIVATE METHODS ---

  private async validate<TExpect>(
    expectedValue:
      | TExpect
      | TExpect[]
      | ((data: TData) => boolean)
      | ((data: TData) => boolean)[],
  ): Promise<boolean> {
    const awaitedData = await this.data;
    const expectedValueArray = Array.isArray(expectedValue)
      ? expectedValue
      : [expectedValue];

    return expectedValueArray.some((compare) => {
      if (compare instanceof Function) return compare(awaitedData);
      return isEqual(awaitedData, compare);
    });
  }

  private createInspection<T extends Awaited<TData>>(
    validation: Promise<boolean>,
    exception: ErrorType,
  ): Inspection<T> {
    const inspection = validation.then(async (valid) => {
      if (!valid) throw exception instanceof Function ? exception() : exception;
      return this.data;
    }) as Inspection<T>;

    inspection.otherwise = (error: ErrorType) => {
      inspection.catch(() => {}); // Prevent unhandled promise rejection
      return this.createInspection(validation, error); // Create a new inspection (promise)
    };

    return inspection;
  }
}

// ----- TYPES -----

type ResolvableData<T> = Awaited<T> | Promise<Awaited<T>>;

type ErrorType = Error | (() => Error);

interface Inspection<T> extends Promise<T> {
  otherwise: (error: ErrorType) => Inspection<T>;
}
