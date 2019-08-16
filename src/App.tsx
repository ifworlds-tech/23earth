import React, { useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import MapEditor from './components/MapEditor';
import { ConfigProvider } from 'antd';
import { HashRouter, Route } from 'react-router-dom';
import MapList from './components/MapList';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <HashRouter>
          <Route path="/" exact component={MapList}/>
          <Route path="/map/:mapId" component={MapEditor}/>
        </HashRouter>
      </div>
    </ConfigProvider>
  );
}

export default App;
