
export const meta = {
  id: 'example.hello',
  name: 'HGhub Hello',
  version: '1.0.0',
  protocol: 1
};

export default hg => ({
  media: {
    getDetail({ id }) {
      return {
        id,
        title: '示例短片',
        playlists: [{
          id: 'main',
          episodes: [{
            id: 'first',
            index: 1,
            label: '第一集'
          }]
        }]
      };
    },

    resolvePlayback() {
      throw new hg.PluginError(
        'UNSUPPORTED',
        '请在插件设置中配置媒体地址'
      );
    }
  },

  search: {
    search({ query }) {
      return {
        items: [{
          id: 'demo',
          title: query || '示例短片'
        }],
        next: null
      };
    }
  }
});
