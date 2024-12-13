import { Roles, RolesId } from '../authorities-constans';

export interface IUser {
  username: string;
  password?: string;
  role?: Roles | undefined;
  roleId?: RolesId | undefined;
}
