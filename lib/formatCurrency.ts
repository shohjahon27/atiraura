// lib/formatCurrency.ts
export function formatCurrency(amount: number, currency: string = 'UZS') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    amount = 0;
  }
  
  const safeCurrency = currency?.toUpperCase() || 'UZS';
  
  // Uzbek som formatting
  if (safeCurrency === 'UZS') {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('UZS', 'soʻm');
  }
  
  // Other currencies
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: safeCurrency,
  }).format(amount);
}