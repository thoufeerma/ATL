export const getWooCommerceApiUrl = (endpoint: string) => {
  const url = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
  }
  return `${url}/wp-json/wc/v3/${endpoint}`;
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
