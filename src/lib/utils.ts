/**
 * Format a number as currency
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format a date string
 */
export const formatDate = (date: string | number | Date, format = 'en-US'): string => {
  return new Intl.DateTimeFormat(format).format(new Date(date));
};

/**
 * Create a URL-friendly slug
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
