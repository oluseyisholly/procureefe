export type MemberStatus = "Active" | "Inactive" | "Pending";

export type MemberTone = "rose" | "sky" | "amber" | "emerald" | "slate";

export type PurchaseStatus = "Pending" | "Reconciled";

export type MemberPurchaseHistory = {
  id: string;
  marketRunLabel: string;
  itemsLabel: string;
  dateLabel: string;
  amount: number;
  status: PurchaseStatus;
};

export type MemberRecord = {
  id: string;
  serial: number;
  name: string;
  phoneNumber: string;
  dateJoined: string;
  dateJoinedLong: string;
  status: MemberStatus;
  tone: MemberTone;
  email: string;
  address: string;
  totalOrders: number;
  totalSpents: number;
  referrals: number;
  purchaseHistory: MemberPurchaseHistory[];
};

const purchaseHistorySeed: MemberPurchaseHistory[] = [
  {
    id: "ph-1",
    marketRunLabel: "Market Run #206",
    itemsLabel: "15 items",
    dateLabel: "Mar 15, 2025",
    amount: 98230.4,
    status: "Pending",
  },
  {
    id: "ph-2",
    marketRunLabel: "Market Run #205",
    itemsLabel: "8 items",
    dateLabel: "Feb 05, 2025",
    amount: 150450.75,
    status: "Reconciled",
  },
  {
    id: "ph-3",
    marketRunLabel: "Market Run #204",
    itemsLabel: "12 items",
    dateLabel: "Jan 24, 2025",
    amount: 123893.98,
    status: "Reconciled",
  },
  {
    id: "ph-4",
    marketRunLabel: "Market Run #204",
    itemsLabel: "12 items",
    dateLabel: "Jan 24, 2025",
    amount: 123893.98,
    status: "Reconciled",
  },
  {
    id: "ph-5",
    marketRunLabel: "Market Run #204",
    itemsLabel: "12 items",
    dateLabel: "Jan 24, 2025",
    amount: 123893.98,
    status: "Reconciled",
  },
];

export const MEMBERS: MemberRecord[] = [
  {
    id: "member-1",
    serial: 1,
    name: "Ngozi Obi",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Active",
    tone: "rose",
    email: "ngozi.obi@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 121,
    totalSpents: 394893.9,
    referrals: 1,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-2",
    serial: 2,
    name: "Ifeoma Okeke",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Inactive",
    tone: "sky",
    email: "ifeoma.okeke@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 84,
    totalSpents: 204550.0,
    referrals: 0,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-3",
    serial: 3,
    name: "Fatima Musa",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Active",
    tone: "amber",
    email: "fatima.musa@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 67,
    totalSpents: 155800.2,
    referrals: 2,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-4",
    serial: 4,
    name: "Chukwuemeka Eze",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Pending",
    tone: "emerald",
    email: "chukwuemeka.eze@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 45,
    totalSpents: 110230.35,
    referrals: 1,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-5",
    serial: 5,
    name: "Aisha Bello",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Active",
    tone: "slate",
    email: "aisha.bello@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 72,
    totalSpents: 182000.12,
    referrals: 3,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-6",
    serial: 6,
    name: "Babatunde Adebayo",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Inactive",
    tone: "rose",
    email: "babatunde.adebayo@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 54,
    totalSpents: 130450.11,
    referrals: 1,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-7",
    serial: 7,
    name: "Emeka Okoro",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Pending",
    tone: "sky",
    email: "emeka.okoro@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 62,
    totalSpents: 176400.85,
    referrals: 2,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-8",
    serial: 8,
    name: "Tosin Adeyemi",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Active",
    tone: "amber",
    email: "tosin.adeyemi@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 88,
    totalSpents: 221040.22,
    referrals: 1,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-9",
    serial: 9,
    name: "Kemi Daniels",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Inactive",
    tone: "emerald",
    email: "kemi.daniels@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 39,
    totalSpents: 90000.0,
    referrals: 0,
    purchaseHistory: purchaseHistorySeed,
  },
  {
    id: "member-10",
    serial: 10,
    name: "Rasheed Balogun",
    phoneNumber: "+234(0) 81 4072 8393",
    dateJoined: "12/02/2026",
    dateJoinedLong: "12th July 2020",
    status: "Active",
    tone: "slate",
    email: "rasheed.balogun@gmail.com",
    address: "22B Idowu Taylor St, Lagos",
    totalOrders: 58,
    totalSpents: 144120.6,
    referrals: 1,
    purchaseHistory: purchaseHistorySeed,
  },
];

export function getMemberById(memberId: string): MemberRecord | undefined {
  return MEMBERS.find((member) => member.id === memberId);
}

