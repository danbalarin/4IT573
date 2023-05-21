import { UnauthorizedException, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator(async (_, request: any) => {
  if (!request.user) {
    throw new UnauthorizedException();
  }
  return request.user as AuthUserType;
});

export type AuthUserType = {
  email: string;
  sub: number;
};
