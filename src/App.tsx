import React, { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'

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
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    })

    // console.log(result)
    setCode(result.outputFiles[0].text)
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
