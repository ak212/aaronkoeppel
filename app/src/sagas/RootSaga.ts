import { all } from "redux-saga/effects"

import { campsitesSaga } from "./CampsitesSaga"
import { nhlScoreboardSaga } from "./NhlScoreboardSaga"

export default function* rootSaga() {
   yield all([campsitesSaga(), nhlScoreboardSaga()])
}
