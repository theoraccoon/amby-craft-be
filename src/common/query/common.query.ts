import { Prisma } from '@prisma/client';

interface CommonQuery {
  include: Prisma.UserInclude;
  omit: {
    password: boolean;
    refreshToken: boolean;
    googleId: boolean;
    roleId: boolean;
    refreshTokenExpiry: boolean;
  };
}

const commonQuery: CommonQuery = {
  include: { role: true },
  omit: {
    password: true,
    refreshToken: true,
    googleId: true,
    roleId: true,
    refreshTokenExpiry: true,
  },
};

export default commonQuery;
