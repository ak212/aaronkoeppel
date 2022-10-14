import { RootState } from '../../state/store'

export const nhlScoreboardSelectors = {
  getGames(state: RootState) {
    return state.nhlScoreboard.games
  },
}
