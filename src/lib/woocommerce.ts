export const getWooCommerceApiUrl = (endpoint: string) => {
  const url = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
  }
  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return `${baseUrl}/wp-json/wc/v3/${endpoint}`;
};

export const fetchWooCommerce = async (endpoint: string, options: RequestInit = {}) => {
  const url = getWooCommerceApiUrl(endpoint);
  
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('WooCommerce Consumer Key or Secret is missing');
  }

  // Create basic auth header
  const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API Error: ${response.statusText}`);
  }

  return response.json();
};

// Fetches every page of a list endpoint (WooCommerce caps per_page at 100).
export const fetchAllWooCommerce = async (endpoint: string, maxPages = 20): Promise<any[]> => {
  const sep = endpoint.includes('?') ? '&' : '?';
  const results: any[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const batch = await fetchWooCommerce(`${endpoint}${sep}per_page=100&page=${page}`);
    if (!Array.isArray(batch)) break;
    results.push(...batch);
    if (batch.length < 100) break;
  }
  return results;
};
