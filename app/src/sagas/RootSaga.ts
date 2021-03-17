import { all, AllEffect, ForkEffect } from 'redux-saga/effects'

import { campsitesSaga } from './CampsitesSaga'
import { nhlScoreboardSaga } from './NhlScoreboardSaga'

export default function* rootSaga(): Generator<
  AllEffect<Generator<AllEffect<ForkEffect<never>>, void, unknown>>,
  void,
  unknown
> {
  yield all([campsitesSaga(), nhlScoreboardSaga()])
}
