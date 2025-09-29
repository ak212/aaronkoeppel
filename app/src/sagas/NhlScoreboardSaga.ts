import { all, call, put, takeEvery } from 'redux-saga/effects';

import NhlScoreboardApi from '../remote/NhlScoreboardApi';
import { finishLoading, startLoading } from '../state/Loading';
import { GET_GAMES, getGames, getGamesSuccess } from '../store/nhl-scoreboard/nhlScoreboard.actions';
import { NhlScoreboardResponse } from '../store/nhl-scoreboard/nhlScoreboard.types';

function* getGamesGenerator({ payload: { gameDate } }: ReturnType<typeof getGames>) {
  yield put(startLoading('nhlScores'));

  const scoreboard: NhlScoreboardResponse = yield call(NhlScoreboardApi.getGames, gameDate);

  if (scoreboard && scoreboard.games.length > 0) {
    yield put(getGamesSuccess(scoreboard.games));
  } else {
    yield put(getGamesSuccess([]));
  }

  yield put(finishLoading('nhlScores'));
}

export function* nhlScoreboardSaga() {
  yield all([takeEvery(GET_GAMES, getGamesGenerator)]);
}
