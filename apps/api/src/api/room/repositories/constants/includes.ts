import { Prisma } from 'src/generated/prisma/client';

export const activeMembershipsInclude = {
  where: { leftAt: null },
  include: { user: true },
} satisfies Prisma.Room$membershipsArgs;
