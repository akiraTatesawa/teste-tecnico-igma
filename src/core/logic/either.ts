/* eslint-disable max-classes-per-file */
/**
 * Methods isLeft() and isRight()
 * are using a typescript feature called 'type guard'
 */

export class Left<L, R> {
  public readonly result: L;

  constructor(result: L) {
    this.result = result;
  }

  public isLeft(): this is Left<L, R> {
    return true;
  }

  public isRight(): this is Right<L, R> {
    return false;
  }
}

export class Right<L, R> {
  public readonly result: R;

  constructor(result: R) {
    this.result = result;
  }

  public isLeft(): this is Left<L, R> {
    return false;
  }

  public isRight(): this is Right<L, R> {
    return true;
  }
}

export type Either<Error, Success> = Left<Error, Success> | Right<Error, Success>;

export function left<Error, Success>(result: Error): Either<Error, Success> {
  return new Left(result);
}

export function right<Error, Success>(result: Success): Either<Error, Success> {
  return new Right(result);
}
