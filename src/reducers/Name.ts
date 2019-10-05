import { Reducer } from "redux";
import { State } from "./Root";

export type Name = {
    name: string
    isAaron: boolean
}

export const initialNameState = {
    name: '',
    isAaron: false
}

/* Action Definition */
export const SET_NAME = 'SET_NAME'
export const NAME_IS_AARON = 'NAME_IS_AARON'
export const CLEAR_NAME = 'CLEAR_NAME'

export const nameActions = {
    setName: (name: string) => {
        return { type: SET_NAME, name }
    },
    nameIsAaron: () => {
        return { type: NAME_IS_AARON, isAaron: true }
    }
}

export const nameReducer: Reducer<Name> = (state = initialNameState, action): Name => {
    switch(action.type) {
        case SET_NAME:
            return action.name
        case NAME_IS_AARON:
            return {...state, isAaron: action.isAaron}
        case CLEAR_NAME:
            return {...state, name: ''}
        default:
            return state
    }
}

export const nameSelectors = {
    getName(state: State) {
        return state.name.name
    }
}