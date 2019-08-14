import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import MapEditor from './components/MapEditor';
import { ConfigProvider } from 'antd';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <MapEditor/>
      </div>
    </ConfigProvider>
  );
}

export default App;
