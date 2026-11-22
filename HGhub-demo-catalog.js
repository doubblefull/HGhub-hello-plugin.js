

export const meta = {
  id: 'demo.minimal',
  name: 'HGhub Minimal Test',
  version: '1.0.0',
  protocol: 1
};

export default hg => ({
  media: {
    getDetail({ id }) {
      return {
        id: String(id),
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
        '此最小测试插件未配置播放地址'
      );
    }
  },

  search: {
    search({ query }) {
      return {
        items: [{
          id: 'demo',
          title: String(query || '示例短片')
        }],
        next: null
      };
    }
  }
});
