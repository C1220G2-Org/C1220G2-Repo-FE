import {Role} from './role';
import {Department} from './department';

export interface User {
  id?: number;
  roles: Role;
  name: string;
  password?: string;
  username: string;
  email: string;
  department: Department;
  avatar: string;
}
