export type MarketRunStatus = "Published" | "Closed" | "Reconciled";

export type MarketRunIndexRow = {
  id: string;
  description: string;
  orderDate: string;
  dueDate: string;
  items: number;
  members: number;
  status: MarketRunStatus;
  totalAmount: string;
};

export type ReconciliationUnitLine = {
  id: string;
  unit: string;
  budgetCost: number;
  requestedQty: number;
};

export type ReconciliationItemLine = {
  id: string;
  name: string;
  requestedQuantityLabel: string;
  totalRequesters: number;
  budgetCost: number;
  units: ReconciliationUnitLine[];
};

export type MarketRunReconciliationRecord = {
  id: string;
  title: string;
  orderDate: string;
  dueDate: string;
  totalItems: number;
  budgetTotal: number;
  status: MarketRunStatus;
  itemsPendingReconciliation: number;
  items: ReconciliationItemLine[];
};

export const MARKET_RUN_INDEX_ROWS: MarketRunIndexRow[] = [
  {
    id: "208",
    description: "Fruits",
    orderDate: "2026-01-23",
    dueDate: "2026-01-23",
    items: 23,
    members: 3,
    status: "Published",
    totalAmount: "₦ 123,992.00",
  },
  {
    id: "207",
    description: "Grains",
    orderDate: "2026-01-21",
    dueDate: "2026-01-21",
    items: 21,
    members: 3,
    status: "Published",
    totalAmount: "₦ 12,000.00",
  },
  {
    id: "206",
    description: "Drink",
    orderDate: "2026-01-12",
    dueDate: "2026-01-12",
    items: 12,
    members: 5,
    status: "Closed",
    totalAmount: "₦ 45,000.00",
  },
  {
    id: "205",
    description: "Drink",
    orderDate: "2026-01-12",
    dueDate: "2026-01-12",
    items: 12,
    members: 2,
    status: "Reconciled",
    totalAmount: "₦ 90,000.00",
  },
  {
    id: "204",
    description: "Drink",
    orderDate: "2026-01-12",
    dueDate: "2026-01-12",
    items: 12,
    members: 6,
    status: "Reconciled",
    totalAmount: "₦ 67,000.00",
  },
  {
    id: "203",
    description: "Drink",
    orderDate: "2026-01-12",
    dueDate: "2026-01-12",
    items: 12,
    members: 6,
    status: "Reconciled",
    totalAmount: "₦ 78,000.00",
  },
];

const BASE_RECONCILIATION_ITEMS: ReconciliationItemLine[] = [
  {
    id: "rice",
    name: "Rice",
    requestedQuantityLabel: "23 Bags, 3 Kongo, 4 cups",
    totalRequesters: 12,
    budgetCost: 34399,
    units: [
      { id: "cup", unit: "Cups", budgetCost: 450, requestedQty: 24 },
      { id: "derica", unit: "Derica", budgetCost: 750, requestedQty: 24 },
      { id: "kongo", unit: "Kongo", budgetCost: 1200, requestedQty: 24 },
      { id: "bag", unit: "Bags", budgetCost: 35399, requestedQty: 24 },
    ],
  },
  {
    id: "maize",
    name: "Maize",
    requestedQuantityLabel: "30 Bags, 2 Kongo, 1 cup",
    totalRequesters: 8,
    budgetCost: 29500,
    units: [
      { id: "cup", unit: "Cups", budgetCost: 350, requestedQty: 18 },
      { id: "kongo", unit: "Kongo", budgetCost: 1000, requestedQty: 18 },
      { id: "bag", unit: "Bags", budgetCost: 28150, requestedQty: 18 },
    ],
  },
  {
    id: "beans",
    name: "Beans",
    requestedQuantityLabel: "15 Bags, 5 Kongo, 2 cups",
    totalRequesters: 10,
    budgetCost: 20200,
    units: [
      { id: "cup", unit: "Cups", budgetCost: 300, requestedQty: 16 },
      { id: "kongo", unit: "Kongo", budgetCost: 900, requestedQty: 16 },
      { id: "bag", unit: "Bags", budgetCost: 19000, requestedQty: 16 },
    ],
  },
  {
    id: "oats",
    name: "Oats",
    requestedQuantityLabel: "10 Bags, 1 Kongo, 2 cups",
    totalRequesters: 7,
    budgetCost: 31750,
    units: [
      { id: "cup", unit: "Cups", budgetCost: 400, requestedQty: 12 },
      { id: "kongo", unit: "Kongo", budgetCost: 1100, requestedQty: 12 },
      { id: "bag", unit: "Bags", budgetCost: 30250, requestedQty: 12 },
    ],
  },
  {
    id: "wheat",
    name: "Wheat",
    requestedQuantityLabel: "20 Bags, 4 Kongo, 3 cups",
    totalRequesters: 9,
    budgetCost: 11800,
    units: [
      { id: "cup", unit: "Cups", budgetCost: 250, requestedQty: 15 },
      { id: "kongo", unit: "Kongo", budgetCost: 700, requestedQty: 15 },
      { id: "bag", unit: "Bags", budgetCost: 10850, requestedQty: 15 },
    ],
  },
  {
    id: "barley",
    name: "Barley",
    requestedQuantityLabel: "12 Bags, 2 Kongo, 1 cup",
    totalRequesters: 6,
    budgetCost: 9600,
    units: [
      { id: "cup", unit: "Cups", budgetCost: 200, requestedQty: 10 },
      { id: "kongo", unit: "Kongo", budgetCost: 650, requestedQty: 10 },
      { id: "bag", unit: "Bags", budgetCost: 8750, requestedQty: 10 },
    ],
  },
];

export const MARKET_RUN_RECONCILIATION_RECORDS: MarketRunReconciliationRecord[] =
  MARKET_RUN_INDEX_ROWS.map((row) => ({
    id: row.id,
    title: `${row.description} Wholesale Market Visit`,
    orderDate: row.orderDate,
    dueDate: row.dueDate,
    totalItems: row.items,
    budgetTotal: parseNairaToNumber(row.totalAmount),
    status: row.status,
    itemsPendingReconciliation: 6,
    items: BASE_RECONCILIATION_ITEMS,
  }));

export function getMarketRunReconciliationRecord(
  marketRunId: string,
): MarketRunReconciliationRecord | undefined {
  return MARKET_RUN_RECONCILIATION_RECORDS.find(
    (record) => record.id === marketRunId,
  );
}

function parseNairaToNumber(value: string): number {
  const normalized = value.replace(/[₦,\s]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
