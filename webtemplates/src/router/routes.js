import Layout from '../layout'

/**
 * hidden: true                  如果设置为 true，该项菜单将不会显示在菜单栏中(默认为 false)
 * meta : {
    title: 'title'               菜单名
    icon: 'icon-name'            图标名
    fixed: true                  如果设置为 true，该项 tag 将一直存在 tag 栏中(默认为 false)
  }
 * */

export const asyncRoutes = [
  {
    path: '/data',
    name: 'FormTable',
    component: Layout,
    meta: {
      title: '数据源',
      icon: 'vue-dsn-icon-bianjiqi'
    },
    children: [
      {
        path: '/proxy',
        name: 'proxyData',
        component: () => import('../views/data/proxy'),
        meta: {
          title: '代理数据'
        }
      }
    ]

  },
  {
    path: '/proxySessionData',
    name: 'FormTable',
    component: Layout,
    meta: {
      title: '数据源',
      icon: 'vue-dsn-icon-biaoge'
    },
    children: [
      {
        path: '/cookies',
        name: 'proxySessionData',
        component: () => import('../views/data/cookies'),
        meta: {
          title: 'Session数据'
        }
      }
    ]

  },
  {
    path: '/plugins',
    name: 'FormTable',
    component: Layout,
    meta: {
      title: '数据源',
      icon: 'el-icon-shopping-bag-1'
    },
    children: [
      {
        path: '/Plugins',
        name: 'plugins',
        component: () => import('../views/data/plugins'),
        meta: {
          title: '插件配置'
        }
      }
    ]

  },
  {
    path: 'http://tproxy.fat.qa.pab.com.cn/api/certdownload',
    name: 'doc',
    component: Layout,
    meta: {
      title: '证书下载',
      icon: 'el-icon-download'
    }
  },
  {
    path: '/settings',
    name: 'FormTable',
    component: Layout,
    meta: {
      title: '数据源',
      icon: 'vue-dsn-icon-shuxing'
    },
    children: [
      {
        path: '/setting',
        name: 'settings',
        component: () => import('../views/settings/settings'),
        meta: {
          title: '系统设置'
        }
      }
    ]

  },
  // {
  //   path: '/form-table',
  //   name: 'FormTable',
  //   component: Layout,
  //   redirect: '/form-table/table-classic',
  //   meta: {
  //     title: '表格&表单',
  //     icon: 'vue-dsn-icon-biaoge'
  //   },
  //   children: [
  //     {
  //       path: 'table-classic',
  //       name: 'TableClassic',
  //       component: () => import('../views/form-table/TableClassic'),
  //       meta: {
  //         title: '综合表格'
  //       }
  //     },
  //     {
  //       path: 'form-list',
  //       name: 'FormList',
  //       component: () => import('../views/form-table/FormList'),
  //       meta: {
  //         title: '表单列表'
  //       }
  //     },
  //     {
  //       path: 'table-inline-edit',
  //       name: 'TableInlineEdit',
  //       component: () => import('../views/form-table/TableInlineEdit'),
  //       meta: {
  //         title: '行内编辑表格'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/editors',
  //   name: 'Editors',
  //   component: Layout,
  //   redirect: '/editors/markdown',
  //   meta: {
  //     title: '编辑器',
  //     icon: 'vue-dsn-icon-bianjiqi'
  //   },
  //   children: [
  //     {
  //       path: 'markdown',
  //       name: 'Markdown',
  //       component: () => import('../views/editors/MarkdownEditor'),
  //       meta: {
  //         title: 'Markdown编辑器'
  //       }
  //     },
  //     {
  //       path: 'rich-text',
  //       name: 'ImageRichText',
  //       component: () => import('../views/editors/RichTextEditor'),
  //       meta: {
  //         title: '富文本编辑器'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/tree',
  //   name: 'Tree',
  //   component: Layout,
  //   redirect: '/tree/org-tree',
  //   meta: {
  //     title: '树形结构',
  //     icon: 'vue-dsn-icon-shuxing'
  //   },
  //   children: [
  //     {
  //       path: 'org-tree',
  //       name: 'OrgTree',
  //       component: () => import('../views/tree/OrgTree'),
  //       meta: {
  //         title: '组织树'
  //       }
  //     },
  //     {
  //       path: 'ele-tree',
  //       name: 'EleTree',
  //       component: () => import('../views/tree/EleTree'),
  //       meta: {
  //         title: '控件树'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/error-page',
    name: 'ErrorPage',
    component: Layout,
    hidden: true,
    redirect: '/error-page/page-401',
    meta: {
      title: '错误页面',
      icon: 'vue-dsn-icon-bug'
    },
    children: [
      {
        path: 'page-401',
        name: 'Page401',
        component: () => import('../views/error-page/401'),
        meta: {
          title: '401页面'
        }
      },
      {
        path: 'page-404',
        name: 'Page404',
        component: () => import('../views/error-page/404'),
        meta: {
          title: '404页面'
        }
      }
    ]
  }
]
