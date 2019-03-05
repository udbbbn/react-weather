import { createStore } from 'redux';
import React, { Component } from 'react'


interface testobj {
    type: string
}
interface StoreState {
    stateNum: number
}

function counter(state: StoreState = {
    stateNum: 0
}, action: testobj) : StoreState {
    switch (action.type) {
        case 'INCREMENT':
            return {...state, stateNum: state.stateNum + 1}
            break;
        case 'DECREMENT':
            return {...state, stateNum: state.stateNum - 1}
            break;
        default:
            return state
            break;
    }
    return state
}

export const store = createStore(counter);
let a = store.getState().stateNum;
// 订阅
store.subscribe(() => {
    a = store.getState().stateNum;
    console.log(a)
})
// store.dispatch({
//     type: 'INCREMENT'
// })

export default class storeIndex extends Component {
  render() {
    return (
      <div>
        <h1>{a}</h1>
      </div>
    )
  }
}
