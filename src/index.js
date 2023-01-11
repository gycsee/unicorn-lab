import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import { StyleProvider } from '@ant-design/cssinjs';

import App from 'containers/App';
import * as serviceWorker from './serviceWorker';

dayjs.locale('zh-cn');
const { darkAlgorithm, compactAlgorithm } = theme;

ReactDOM.render(
  // 由于 antd 组件的默认文案是英文，所以需要修改为中文
  <StyleProvider hashPriority="high">
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: [darkAlgorithm, compactAlgorithm],
      }}
    >
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </StyleProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
