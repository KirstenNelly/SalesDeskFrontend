export const demoProducts = [
  { id: 1, name: 'Fresh Milk 1L', sku: 'SKU-1001', barcode: '1001', category: 'Dairy', price: 120, stock: 18 },
  { id: 2, name: 'Bread Loaf', sku: 'SKU-1002', barcode: '1002', category: 'Bakery', price: 95, stock: 7 },
  { id: 3, name: 'Ground Coffee 250g', sku: 'SKU-1003', barcode: '1003', category: 'Groceries', price: 650, stock: 12 },
  { id: 4, name: 'Soap Bar', sku: 'SKU-1004', barcode: '1004', category: 'Household', price: 85, stock: 5 },
  { id: 5, name: 'Energy Drink', sku: 'SKU-1005', barcode: '1005', category: 'Beverages', price: 180, stock: 21 },
  { id: 6, name: 'Toilet Paper', sku: 'SKU-1006', barcode: '1006', category: 'Household', price: 220, stock: 4 }
];

export const demoSales = [
  { id: 'INV-1042', customer: 'Njeri M.', total: 1250, status: 'Paid', createdAt: '2026-07-29 09:14' },
  { id: 'INV-1043', customer: 'Diana K.', total: 2700, status: 'Pending', createdAt: '2026-07-29 10:02' },
  { id: 'INV-1044', customer: 'Omondi P.', total: 1850, status: 'Paid', createdAt: '2026-07-29 10:47' }
];

export const demoCustomers = [
  { id: 1, name: 'Njeri M.', phone: '0712345678', balance: 0 },
  { id: 2, name: 'Diana K.', phone: '0723456789', balance: 3500 },
  { id: 3, name: 'Omondi P.', phone: '0734567890', balance: 0 }
];

export const demoStock = [
  { sku: 'SKU-1001', name: 'Fresh Milk 1L', stock: 18, reorderLevel: 10 },
  { sku: 'SKU-1002', name: 'Bread Loaf', stock: 7, reorderLevel: 10 },
  { sku: 'SKU-1004', name: 'Soap Bar', stock: 5, reorderLevel: 8 },
  { sku: 'SKU-1006', name: 'Toilet Paper', stock: 4, reorderLevel: 8 }
];

export const demoAdminSummary = {
  dailySales: 'KES 18,450',
  monthlyRevenue: 'KES 624,300',
  lowStockAlerts: 4,
  pendingPayments: 3
};

export const demoCashierSummary = {
  transactions: '24',
  drawer: 'KES 13,450',
  orders: '2'
};
