import { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import bundle from '../bundler/index'
import Resizable from './Resizable'
import { Cell } from '../state';
import { useActions } from '../hooks/useActions'

interface CodeCellProps {
  cell: Cell
}


const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { updateCell } = useActions()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content)
      setCode(output.code)
      setError(output.err)
    }, 800);

    return () => {
      clearTimeout(timer)
    }
  }, [cell.content])




  return (
    <Resizable direction="vertical">
      <div style={{ height: '98%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview error={error} code={code} />
      </div>
    </Resizable>
  );
}

export default CodeCell;