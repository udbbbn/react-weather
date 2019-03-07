import { createStore, AnyAction } from 'redux';
import { UPDATE, Iupdate } from './action';

interface StoreState {
    text: string
}

function cityState(state: StoreState, action: AnyAction): StoreState {
    switch (action.type) {
        case UPDATE:
            const { text } = action;
            return {...state, text}
        default:
            return state
    }
}

export const store = createStore(cityState);