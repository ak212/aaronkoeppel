import { all } from 'redux-saga/effects'

import { campsitesSaga } from './CampsitesSaga'

export default function* rootSaga() {
   yield all([campsitesSaga()])
}
