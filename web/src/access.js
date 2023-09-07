import { ROLE_ADMIN, ROLE_USER } from './shared/constant';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    user: currentUser && currentUser.role === ROLE_USER && currentUser.active,
    admin: currentUser && currentUser.role === ROLE_ADMIN,
  };
}
