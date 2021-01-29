import React, { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm'

function App() {
  const ref = useRef<any>()
  const [code, setCode] = useState('')
  const [input, setInput] = useState('')

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    })

  }

  useEffect(() => {
    startService()
  }, [])


  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    //console.log(ref.current)

    //only does transpiling
    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015'
    })

    //console.log(result)
    setCode(result.code)
  }

  return (
    <div className="App">
      <textarea onChange={e => { setInput(e.target.value) }}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default App;
