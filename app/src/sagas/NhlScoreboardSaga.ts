import { all, AllEffect, call, ForkEffect, put, takeEvery } from 'redux-saga/effects'

import { loadingActions } from '../reducers/Loading'
import NhlScoreboardApi from '../remote/NhlScoreboardApi'
import { GET_GAMES, NhlGame, nhlScoreboardActions } from '../store/nhlScoreboard'

function* getGames() {
  yield put(loadingActions.startLoading('nhlScores'))

  const scoreboard: { dates: any[] } = yield call(NhlScoreboardApi.getGames)
  const date = scoreboard && (scoreboard.dates as any[])

  if (scoreboard && scoreboard.dates && date.length === 1 && date[0].games) {
    yield put(nhlScoreboardActions.getGamesSuccess(scoreboard.dates[0].games as NhlGame[]))
  }

  yield put(loadingActions.finishLoading('nhlScores'))
}

export function* nhlScoreboardSaga(): Generator<AllEffect<ForkEffect<never>>, void, unknown> {
  yield all([takeEvery(GET_GAMES, getGames)])
}
