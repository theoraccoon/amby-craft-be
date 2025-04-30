// src/common/query/common.query.ts
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
    include: {
        role: {
            select: {
                id: true,
                name: true,
                identifier: true,
                description: true,
            },
        },
    },
    omit: {
        password: true,
        refreshToken: true,
        googleId: true,
        roleId: true,
        refreshTokenExpiry: true,
    },
};

export default commonQuery;
