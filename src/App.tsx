import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';
import MapEditor from './components/MapEditor';
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
