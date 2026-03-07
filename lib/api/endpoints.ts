export const API_ENDPOINTS = {
  users: {
    signIn: "/user/signin",
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
