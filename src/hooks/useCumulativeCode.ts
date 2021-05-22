import { useTypedSelector } from './useTypedSelector'

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map(id => data[id]);

    const printFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var print = (value)=>{
      if(typeof value ==='object'){
        if(value.$$typeof && value.props){
          _ReactDOM.render(value, document.querySelector('#root'))
        }
        else{
          document.querySelector('#root').innerHTML = JSON.stringify(value)
        }
      }
      else{
        document.querySelector('#root').innerHTML = value
      }
    }
  `

    const printFuncNoOperation = 'var print = () =>{}'

    const cumulativeCode = []

    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) {
          cumulativeCode.push(printFunc)
        }
        else {
          cumulativeCode.push(printFuncNoOperation)
        }
        cumulativeCode.push(c.content)
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join('\n')


}