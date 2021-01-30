import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import bundle from '../bundler/index'
import Resizable from './Resizable'

function CodeCell() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [input, setInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input)
      setCode(output.code)
      setError(output.err)
    }, 800);

    return () => {
      clearTimeout(timer)
    }
  }, [input])




  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="console.log('Hello World !')"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview error={error} code={code} />
      </div>
    </Resizable>
  );
}

export default CodeCell;