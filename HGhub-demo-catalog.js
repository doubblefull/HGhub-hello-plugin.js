
export const meta = {
  id: 'example.http-test',
  name: 'HGhub HTTP Test',
  version: '1.1.0',
  protocol: 1
};

const API = 'https://dummyjson.com';

function mapItem(row) {
  return {
    id: String(row.id),
    title: row.title || 'Untitled',
    cover: row.thumbnail || '',
    description: row.description || '',
    tags: row.tags || []
  };
}

async function fetchJSON(hg, url, ctx) {
  const response = await hg.http.fetch({
    url,
    responseType: 'json',
    signal: ctx?.signal
  });

  if (!response.ok) {
    throw new hg.PluginError(
      'UPSTREAM_ERROR',
      `HTTP ${response.status}`
    );
  }

  if (!response.data || typeof response.data !== 'object') {
    throw new hg.PluginError(
      'UPSTREAM_CHANGED',
      'Invalid JSON response'
    );
  }

  return response.data;
}

export default hg => ({
  search: {
    async search({ query }, ctx) {
      const keyword = String(query || '').trim();

      if (!keyword) {
        return {
          items: [],
          next: null
        };
      }

      const url =
        `${API}/products/search?q=${encodeURIComponent(keyword)}`;

      const data = await fetchJSON(hg, url, ctx);

      if (!Array.isArray(data.products)) {
        throw new hg.PluginError(
          'UPSTREAM_CHANGED',
          'Search response is missing products'
        );
      }

      return {
        items: data.products.map(mapItem),
        next: null
      };
    }
  },

  media: {
    async getDetail({ id }, ctx) {
      const data = await fetchJSON(
        hg,
        `${API}/products/${encodeURIComponent(id)}`,
        ctx
      );

      return {
        id: String(data.id),
        title: data.title || 'Untitled',
        cover: data.thumbnail || '',
        description: data.description || '',
        tags: data.tags || [],
        playlists: [{
          id: 'main',
          episodes: [{
            id: String(data.id),
            index: 1,
            label: data.title || 'Item'
          }]
        }]
      };
    },

    resolvePlayback() {
      throw new hg.PluginError(
        'UNSUPPORTED',
        'Playback is not implemented'
      );
    }
  }
});
