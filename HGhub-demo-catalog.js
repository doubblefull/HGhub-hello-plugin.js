
export const meta = {
  id: 'demo.catalog',
  name: 'Demo Catalog',
  version: '1.0.0',
  protocol: 1
};

const catalog = [
  {
    id: 'demo-1',
    title: '星际探索',
    description: '一段关于太空探索的演示内容。',
    category: '科幻',
    year: 2025
  },
  {
    id: 'demo-2',
    title: '海洋世界',
    description: '海洋与自然纪录演示。',
    category: '纪录',
    year: 2024
  },
  {
    id: 'demo-3',
    title: '城市生活',
    description: '城市生活主题演示。',
    category: '生活',
    year: 2024
  },
  {
    id: 'demo-4',
    title: '自然之旅',
    description: '自然风景主题演示。',
    category: '自然',
    year: 2023
  },
  {
    id: 'demo-5',
    title: '未来科技',
    description: '科技主题演示内容。',
    category: '科幻',
    year: 2025
  }
];

export default hg => ({
  home: {
    getHome() {
      return {
        items: catalog.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description
        }))
      };
    }
  },

  search: {
    search({ query }) {
      const q = String(query || '').trim().toLowerCase();

      return {
        items: catalog
          .filter(item =>
            !q ||
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
          )
          .map(item => ({
            id: item.id,
            title: item.title,
            description: item.description
          })),
        next: null
      };
    }
  },

  media: {
    getDetail({ id }) {
      const item = catalog.find(x => x.id === String(id));

      if (!item) {
        throw new hg.PluginError(
          'NOT_FOUND',
          '找不到该演示项目'
        );
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        playlists: [
          {
            id: 'main',
            episodes: [
              {
                id: 'first',
                index: 1,
                label: '演示条目'
              }
            ]
          }
        ]
      };
    },

    resolvePlayback() {
      throw new hg.PluginError(
        'UNSUPPORTED',
        '请在插件设置中配置自己控制的测试媒体地址'
      );
    }
  }
});
