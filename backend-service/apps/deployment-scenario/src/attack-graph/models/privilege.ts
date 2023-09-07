export enum Privilege {
  OS_ADMIN = 10,
  OS_USER = 9,
  APP_ADMIN = 8,
  APP_USER = 7,
  NONE = 1,
}

export const ConvertPrivileges = {
  NONE: Privilege.NONE,
  APP_USER: Privilege.APP_USER,
  APP_ADMIN: Privilege.APP_ADMIN,
  OS_USER: Privilege.OS_USER,
  OS_ADMIN: Privilege.OS_ADMIN,
};
