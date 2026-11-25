export const getWooCommerceApiUrl = (endpoint: string) => {
  const url = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
  }
  // The store key can read customer data, so never let an endpoint climb out of its path.
  const path = endpoint.split('?')[0];
  if (/\.\.|%2e|\\/i.test(path)) {
    throw new Error('Invalid WooCommerce endpoint');
  }
  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return `${baseUrl}/wp-json/wc/v3/${endpoint}`;
};

// WooCommerce responses are cached in Next's data cache for this many seconds, so
// pages don't wait on WordPress for every visitor. Edits in wp-admin show up on the
// site within this window.
export const WOO_REVALIDATE_SECONDS = 300;

const requestWooCommerce = async (endpoint: string, options: RequestInit = {}) => {
  const url = getWooCommerceApiUrl(endpoint);

  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('WooCommerce Consumer Key or Secret is missing');
  }

  const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`;

  // Cache by default; callers can opt out with { cache: 'no-store' } or their own `next` options.
  const caching: RequestInit =
    options.cache || (options as { next?: unknown }).next
      ? {}
      : ({ next: { revalidate: WOO_REVALIDATE_SECONDS } } as RequestInit);

  const response = await fetch(url, {
    ...caching,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API Error (${response.status}): ${response.statusText} [${endpoint.split('?')[0]}]`);
  }

  return response;
};

export const fetchWooCommerce = async (endpoint: string, options: RequestInit = {}) => {
  const response = await requestWooCommerce(endpoint, options);
  return response.json();
};

// Fetches every page of a list endpoint (WooCommerce caps per_page at 100).
// Reads the total page count from the first response, then loads the rest in parallel.
export const fetchAllWooCommerce = async (endpoint: string, maxPages = 20): Promise<any[]> => {
  const sep = endpoint.includes('?') ? '&' : '?';
  const pageUrl = (page: number) => `${endpoint}${sep}per_page=100&page=${page}`;

  const first = await requestWooCommerce(pageUrl(1));
  const firstBatch = await first.json();
  if (!Array.isArray(firstBatch)) return [];

  const totalPages = Math.min(Number(first.headers.get('x-wp-totalpages')) || 1, maxPages);
  if (totalPages <= 1) return firstBatch;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => fetchWooCommerce(pageUrl(i + 2))),
  );
  return [firstBatch, ...rest].flatMap((batch) => (Array.isArray(batch) ? batch : []));
};
