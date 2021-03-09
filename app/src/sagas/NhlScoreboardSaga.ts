import { all, call, put, takeEvery } from 'redux-saga/effects'

import { loadingActions } from '../reducers/Loading'
import { GET_GAMES, NhlGame, nhlScoreboardActions } from '../reducers/NhlScoreboard'
import NhlScoreboardApi from '../remote/NhlScoreboardApi'

function* getGames({ }: ReturnType<typeof nhlScoreboardActions.getGames>) {
  yield put(loadingActions.startLoading('nhlScores'))

  const scoreboard: { dates: any[] } = yield call(NhlScoreboardApi.getGames)
  const date = scoreboard && (scoreboard.dates as any[])

  if (scoreboard && scoreboard.dates && date.length === 1 && date[0].games) {
    yield put(nhlScoreboardActions.getGamesSuccess(scoreboard.dates[0].games as NhlGame[]))
  }

  yield put(loadingActions.finishLoading('nhlScores'))
}

export function* nhlScoreboardSaga() {
  yield all([takeEvery(GET_GAMES, getGames)])
}
