import { useRef, useEffect } from "react"
import './Preview.css'

interface PreviewProps {
  code: string
}

const html = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
  <style> html {background-color:white;}</style>
  </head>
  
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



const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iFrame = useRef<any>()

  useEffect(() => {
    iFrame.current.srcdoc = html;
    setTimeout(() => {
      iFrame.current.contentWindow.postMessage(code, '*')
    }, 80);
  }, [code])


  return (
    <div className="preview-wrapper">
      <iframe
        ref={iFrame}
        sandbox="allow-scripts"
        title="notebook"
        srcDoc={html}
      />
    </div>

  )
}

export default Preview
