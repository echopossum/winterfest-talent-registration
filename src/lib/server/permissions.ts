import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

export const ac = createAccessControl(defaultStatements);

export const adminRole = ac.newRole({ ...adminAc.statements });

// Judges have no user-management permissions; access to /judge is checked by role name.
export const judgeRole = ac.newRole({ user: [], session: [] });

export const roles = { admin: adminRole, judge: judgeRole };

export type AppRole = keyof typeof roles;
