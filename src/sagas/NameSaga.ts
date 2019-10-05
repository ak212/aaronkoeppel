import { nameActions, SET_NAME } from "../reducers/Name";
import { put, all } from "redux-saga/effects";
import { takeEvery } from "redux-saga/effects";

function* isNameAaron(action: ReturnType<typeof nameActions.setName>) {
    const isAaron:boolean = action.name === 'Aaron'
    if (isAaron) {
        yield put(nameActions.nameIsAaron())
    }
}

export function* nameSaga() {
    yield all([
        takeEvery(SET_NAME, isNameAaron)
    ])
}