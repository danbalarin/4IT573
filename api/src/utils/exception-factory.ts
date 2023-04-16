import { ValidationError, BadRequestException } from '@nestjs/common';

export const exceptionFactory = (errors: ValidationError[]) => {
  return new BadRequestException(
    errors.reduce(
      (acc, error) => ({
        ...acc,
        [error.property]: Object.values(error.constraints),
      }),
      {},
    ),
  );
};
