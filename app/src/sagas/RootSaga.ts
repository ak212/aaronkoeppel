import { all } from 'redux-saga/effects'

import { nameSaga } from './NameSaga'

export default function* rootSaga() {
   yield all([nameSaga()])
}
