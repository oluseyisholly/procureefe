export const API_ENDPOINTS = {
  users: {
    signIn: "/user/signin",
    createAdmin: "/user/admin",
    checkEmail: "/user/admin/check-email",
    checkPhone: "/user/admin/check-phone",
    members: "/user/members",
  },
  procureeInvites: {
    create: "/procuree-invites",
    preview: "/procuree-invites/preview",
    acceptSignup: "/procuree-invites/accept-signup",
  },
  categories: {
    index: "/category",
  },
  commodities: {
    index: "/Commodity",
  },
  marketRuns: {
    index: "/market-run",
    create: "/market-run",
  },
} as const;
