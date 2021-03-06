import React from 'react';
import CodeCell from './components/CodeCell'
import { Provider } from 'react-redux'
import { store } from './state'
import CellList from './components/CellList'

function App() {

  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
}

export default App;