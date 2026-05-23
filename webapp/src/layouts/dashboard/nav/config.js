// component
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: icon('ic_analytics'),
  // },
  // {
  //   title: 'user',
  //   path: '/dashboard/user',
  //   icon: <Iconify icon={'material-symbols:list-alt-outline-rounded'} />,
  // },
  {
    title: 'รายการอนุมัติ',
    path: '/dashboard/event',
    icon: <Iconify icon={'material-symbols:list-alt-outline-rounded'} />,
    exclusiveLoggedIn: true
  },
  // {
  //   title: 'ตรวจสอบร่าง',
  //   path: '/dashboard/auditdraft',
  //   icon: <Iconify icon={'fluent-mdl2:compliance-audit'} />,
  //   exclusiveLoggedIn: true,
  //   roles: ['superadmin', 'aditor', 'editor'],
  // },
  // {
  //   title: 'รายชื่อบุคลากร',
  //   path: '/dashboard/users',
  //   icon: <Iconify icon={'mdi:people-group'} />,
  //   exclusiveLoggedIn: true,
  // },
  {
    title: 'รหัสงบประมาณ',
    path: '/dashboard/budget',
    icon: <Iconify icon={'arcticons:budgetwatch'} />,
    exclusiveLoggedIn: true,
  },
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  {
    title: 'โปรไฟล์',
    path: '/dashboard/profile',
    icon: <Iconify icon={'carbon:user-profile'} />,
    exclusiveLoggedIn: true
  },
  {
    title: 'เข้าสู่ระบบ',
    path: '/login',
    icon: <Iconify icon={'mdi:login-variant'} />,
    exclusiveLoggedOut: true
  },
  {
    title: 'Admin',
    path: '/dashboard/admin',
    icon: <Iconify icon={'carbon:network-admin-control'} />,
    roles: ['superadmin', 'admin'],
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
