import { all } from 'redux-saga/effects'

import { campsitesSaga } from './CampsitesSaga'
import { nameSaga } from './NameSaga'

export default function* rootSaga() {
   yield all([nameSaga(), campsitesSaga()])
}
