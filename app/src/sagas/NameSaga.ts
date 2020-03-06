import { all, put, takeEvery } from 'redux-saga/effects'

import { nameActions, SET_NAME } from '../reducers/Name'

function* isNameAaron(action: ReturnType<typeof nameActions.setName>) {
   yield put(nameActions.nameIsAaron(action.name === "Aaron"))
}

export function* nameSaga() {
   yield all([takeEvery(SET_NAME, isNameAaron)])
}
