// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  base: '/capital-manage/',
  publicPath: '/capital-manage/',
  define: {
    'process.env.UMI_ENV': 'prod',
    'process.env.REQUEST_URL': 'http://api.cap2.qnvipmall.com'
  },
});
