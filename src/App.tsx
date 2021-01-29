import React, { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'
import CodeEditor from './components/CodeEditor'


function App() {
  const ref = useRef<any>()
  const iFrame = useRef<any>()
  const [input, setInput] = useState('')

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    })

  }

  useEffect(() => {
    startService()
  }, [])


  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iFrame.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(), fetchPlugin(input)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    })

    // console.log(result)
    // setCode(result.outputFiles[0].text)

    iFrame.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
  }

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head></head>
  
  <body>
    <div id="root"></div>
  </body>
  <script>
  window.addEventListener('message', (event)=>{
    try{
      eval(event.data);
    } 
    catch(err){
      const root = document.querySelector('#root');
      root.innerHTML = '<div style="color:red"><h4>Runtime Error :: </h4>' + err + '</div>';
      console.error(err);
    }
    }, false)
  </script>
  </html>
  `

  return (
    <div>
      <CodeEditor
        initialValue="console.log('Hello World !')"
        onChange={(value) => setInput(value)}
      />
      <textarea onChange={e => { setInput(e.target.value) }}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe ref={iFrame} sandbox="allow-scripts" title="notebook" srcDoc={html} />
    </div>
  );
}

export default App;
