import React from 'react';
import CodeCell from './components/CodeCell'
import { Provider } from 'react-redux'
import { store } from './state'
import TextEditor from './components/TextEditor'

function App() {

  return (
    <Provider store={store}>
      <div>
        <TextEditor />
      </div>
    </Provider>
  );
}

export default App;