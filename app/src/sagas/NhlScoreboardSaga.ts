import { all, AllEffect, call, ForkEffect, put, takeEvery } from 'redux-saga/effects'

import { loadingActions } from '../reducers/Loading'
import NhlScoreboardApi from '../remote/NhlScoreboardApi'
import { GET_GAMES, nhlScoreboardActions, NhlScoreboardResponse } from '../store/nhlScoreboard'

function* getGames({ gameDate }: ReturnType<typeof nhlScoreboardActions.getGames>) {
  yield put(loadingActions.startLoading('nhlScores'))

  const scoreboard: NhlScoreboardResponse = yield call(NhlScoreboardApi.getGames, gameDate)

  if (scoreboard && scoreboard.totalGames > 0) {
    yield put(nhlScoreboardActions.getGamesSuccess(scoreboard.dates[0].games))
  } else {
    yield put(nhlScoreboardActions.getGamesSuccess([]))
  }

  yield put(loadingActions.finishLoading('nhlScores'))
}

export function* nhlScoreboardSaga(): Generator<AllEffect<ForkEffect<never>>, void, unknown> {
  yield all([takeEvery(GET_GAMES, getGames)])
}
