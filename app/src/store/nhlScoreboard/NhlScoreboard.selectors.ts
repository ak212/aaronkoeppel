import { State } from '../../reducers/Root'

export const nhlScoreboardSelectors = {
  getGames(state: State) {
    return state.nhlScoreboard.games
  },
}
