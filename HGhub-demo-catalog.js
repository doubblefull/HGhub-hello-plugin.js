
export const meta = {
  id: 'example.http-test',
  name: 'HGhub HTTP Test',
  version: '1.0.0',
  protocol: 1
};

const BASE = 'https://dummyjson.com';

function normalizeItem(item) {
  return {
    id: String(item.id),
    title: item.title || 'Untitled',
    cover: item.thumbnail || '',
    description: item.description || '',
    year: item.year || undefined,
    rating: item.rating || undefined,
    tags: Array.isArray(item.tags) ? item.tags : [],
    detailUrl: `/products/${item.id}`
  };
}

function parseCursor(cursor) {
  if (!cursor) return 0;

  const n = Number(cursor);

  if (!Number.isInteger(n) || n < 0) {
    return 0;
  }

  return n;
}

async function request(hg, url, signal) {
  const res = await hg.http.fetch({
    url,
    responseType: 'json',
    signal
  });

  if (!res.ok) {
    throw new hg.PluginError(
      'NETWORK',
      `HTTP request failed: ${res.status}`
    );
  }

  return res.data;
}

export default hg => ({
  search: {
    async search({ query, cursor }, ctx) {
      const q = String(query || '').trim();

      if (!q) {
        return {
          items: [],
          next: null
        };
      }

      const skip = parseCursor(cursor);
      const limit = 20;

      const url =
        `${BASE}/products/search?q=${encodeURIComponent(q)}` +
        `&limit=${limit}&skip=${skip}`;

      const data = await request(
        hg,
        url,
        ctx?.signal
      );

      const products = Array.isArray(data.products)
        ? data.products
        : [];

      return {
        items: products.map(normalizeItem),
        next:
          skip + products.length < (data.total || 0)
            ? String(skip + products.length)
            : null,
        total: data.total
      };
    }
  },

  media: {
    async getDetail({ id }, ctx) {
      const data = await request(
        hg,
        `${BASE}/products/${encodeURIComponent(id)}`,
        ctx?.signal
      );

      return {
        id: String(data.id),
        title: data.title || 'Untitled',
        cover: data.thumbnail || '',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        playlists: [{
          id: 'main',
          episodes: [{
            id: String(data.id),
            index: 1,
            label: data.title || 'Item 1'
          }]
        }]
      };
    },

    resolvePlayback() {
      throw new hg.PluginError(
        'UNSUPPORTED',
        'This test plugin does not provide video playback.'
      );
    }
  }
});
