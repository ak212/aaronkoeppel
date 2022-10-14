import { all, call, put, takeEvery } from 'redux-saga/effects'

import NhlScoreboardApi from '../remote/NhlScoreboardApi'
import { finishLoading, startLoading } from '../state/Loading'
import { getGames, getGamesSuccess, GET_GAMES, NhlScoreboardResponse } from '../store/nhlScoreboard'

function* getGamesGenerator({ payload: { gameDate } }: ReturnType<typeof getGames>) {
  yield put(startLoading('nhlScores'))

  const scoreboard: NhlScoreboardResponse = yield call(NhlScoreboardApi.getGames, gameDate)

  if (scoreboard && scoreboard.totalGames > 0) {
    yield put(getGamesSuccess(scoreboard.dates[0].games))
  } else {
    yield put(getGamesSuccess([]))
  }

  yield put(finishLoading('nhlScores'))
}

export function* nhlScoreboardSaga() {
  yield all([takeEvery(GET_GAMES, getGamesGenerator)])
}
