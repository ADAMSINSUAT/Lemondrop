/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

// let id;
// let role;
 
module.exports = nextConfig;

// {
      //   source: `/dashboard?role=employee`,
      //   destination: '/dashboard/employee',
      // },
    // const admin = [
    //   {
    //     source: '/dashboard/admin',
    //     destination: '/dashboard?role=admin',
    //   }
    // ];
      // {
      //   source: '/employee/[id]',
      //   destination: '/employee/<id>',
      // },
      // {
      //   source: '/employee/',
      //   destination: '/employee/form',
      // },
      // {
      //   source: '/employee/sub-pages/[update]',
      //   destination: '/employee/form?id=<id>',
      // },
      // {
      //   source: '/employer/',
      //   destination: '/employer/form',
      // },
      // {
      //   source: '/employer/[id]',
      //   destination: '/employer/form?id=<id>',
      // }

// module.exports = {
//   async redirects() {
//     return [
//       {
//         source: '/',
//         destination: '/login',
//         permanent: false,
//       },
//     ]
//   },
// }
