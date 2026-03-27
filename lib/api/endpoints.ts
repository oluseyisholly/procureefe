export const API_ENDPOINTS = {
  users: {
    signIn: "/user/signin",
    createAdmin: "/user/admin",
    checkEmail: "/user/admin/check-email",
    checkPhone: "/user/admin/check-phone",
  },
  categories: {
    index: "/category",
  },
  commodities: {
    index: "/Commodity",
  },
  marketRuns: {
    create: "/market-run",
  },
} as const;
