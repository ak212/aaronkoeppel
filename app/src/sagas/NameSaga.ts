import { all, put, takeEvery } from 'redux-saga/effects'

import { nameActions, SET_NAME } from '../reducers/Name'

function* isNameAaron(action: ReturnType<typeof nameActions.setName>) {
   const isAaron: boolean = action.name === "Aaron"
   if (isAaron) {
      yield put(nameActions.nameIsAaron())
   }
}

export function* nameSaga() {
   yield all([takeEvery(SET_NAME, isNameAaron)])
}
