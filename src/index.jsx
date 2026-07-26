import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { cbAntdTheme } from '@/constants/theme.config';
import { DataProvider } from '@/providers/DataProvider';
import { store } from '@/store/store.config';
import { preventPinchZoom } from '@/utils/preventPinchZoom';
import '@/assets/styles/global.css';

preventPinchZoom();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ConfigProvider theme={cbAntdTheme}>
      <BrowserRouter>
        <DataProvider>
          <App />
        </DataProvider>
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);
