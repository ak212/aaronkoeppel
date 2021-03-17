import { Reducer } from 'redux'

import { State } from './Root'

export type NhlScoreboard = {
  games: NhlGame[]
}

export type NhlGame = {
  gamePk: string
  gameType: string
  gameDate: string
  status: GameStatus
  teams: GameTeams
  linescore: LineScore
  scoringPlays: ScoringPlay[]
  venue: TeamVenue
  metadata: GameMetadata
}

type GameMetadata = {
  isManuallyScored: boolean
  isSplitSquad: boolean
  description: string
}

export type ScoringPlay = {
  players: ScoringPlayPlayers[]
  result: ScoringPlayResult
  about: ScoringPlayAbout
  coordinates: ScoringPlayCoordinates
  team: ScoringPlayTeam
}

type ScoringPlayTeam = {
  id: number
  name: string
  link: string
}

type ScoringPlayCoordinates = {
  x: number
  y: number
}

type ScoringPlayAbout = {
  eventIdx: number
  eventId: number
  period: number
  periodType: 'REGULAR'
  ordinalNum: string
  periodTime: string
  periodTimeRemaining: string
  dateTime: string
  goals: ScoringPlayCurrentScore
}

type ScoringPlayCurrentScore = {
  away: number
  home: number
}

type ScoringPlayResult = {
  event: string
  eventCode: string
  eventTypeId: string
  description: string
  secondaryType: string
  strength: ScoringPlayGoalStrength
  emptyNet: false
}

type ScoringPlayGoalStrength = {
  code: string
  name: string
}

type ScoringPlayPlayers = {
  player: ScoringPlayPlayer
  playerType: ScoringPlayPlayerType
  seasonTotal?: number
}

enum ScoringPlayPlayerType {
  SCORER = 'Scorer',
  ASSIST = 'Assist',
  GOALIE = 'Goalie'
}

type ScoringPlayPlayer = {
  id: number
  fullName: string
  link: string
}

type LineScore = {
  currentPeriod: number
  currentPeriodOrdinal: string
  currentPeriodTimeRemaining: string
  periods: GamePeriod[]
  shootoutInfo: ShootoutInfo
  teams: LineScoreTeams
  powerPlayStrength: string
  hasShootout: boolean
  intermissionInfo: IntermissionInfo
  powerPlayInfo: PowerPlayInfo
}

type PowerPlayInfo = {
  situationTimeRemaining: number
  situationTimeElapsed: number
  inSituation: boolean
}

type IntermissionInfo = {
  intermissionTimeRemaining: number
  intermissionTimeElapsed: number
  inIntermission: boolean
}

type LineScoreTeams = {
  home: LineScoreTeam
  away: LineScoreTeam
}

type LineScoreTeam = {
  team: Team
  goals: number
  shotsOnGoal: number
  goalPulled: false
  numSkaters: number
  powerPlay: boolean
}

type ShootoutInfo = {
  away: TeamShootoutInfo
  home: TeamShootoutInfo
}

type TeamShootoutInfo = {
  scores: number
  attempts: number
}

type GamePeriod = {
  periodType: string
  startTime: string
  endTime: string
  num: number
  ordianalNum: string
  home: TeamGamePeriod
  away: TeamGamePeriod
}

type TeamGamePeriod = {
  goals: number
  shotsOnGoal: number
  rinkSide: string
}

type GameTeams = {
  away: GameTeam
  home: GameTeam
}

type GameTeam = {
  score: number
  team: Team
}

type Team = {
  id: number
  name: string
  venue: TeamVenue
  abbreviation: string
  teamName: string
  locationName: string
  link: string
  division: Division
  conference: Conference
  franchise: Franchise
  shortName: string
  officialSiteUrl: string
  franchiseId: number
  active: boolean
}

type Division = {
  id: number
  name: string
  nameShort: string
  abbreviation: string
  link: string
}

type Conference = {
  id: number
  name: string
  link: string
}

type Franchise = {
  franchiseId: number
  teamName: string
  link: string
}

type TeamVenue = {
  id: number
  name: string
  city?: string
  link: string
}

type GameStatus = {
  abstractGameState: AbstractGameState
  codedGameState: string
  detailedState: DetailedGameState
  statusCode: string
  startTimeTBD: boolean
}

export enum AbstractGameState {
  LIVE = 'Live',
  FINAL = 'Final'
}

enum DetailedGameState {
  IN_PROGRESS = 'In Progress',
  FINAL = 'Final'
}

/* Action Definition */
export const GET_GAMES = 'GET_GAMES'
export const GET_GAMES_SUCCESS = 'GET_GAMES_SUCCESS'
export const SET_TEAM_LOGOS = 'SET_TEAM_LOGOS'

export const nhlScoreboardActions = {
  getGames: () => {
    return { type: GET_GAMES }
  },
  getGamesSuccess: (games: NhlGame[]) => {
    return { type: GET_GAMES_SUCCESS, games }
  }
}

export const initialScoreboardState = {
  games: []
}

export const nhlScoreboardReducer: Reducer<NhlScoreboard> = (state = initialScoreboardState, action): NhlScoreboard => {
  switch (action.type) {
    case GET_GAMES_SUCCESS:
      if (action.games) {
        return { ...state, games: [...action.games] }
      }
      return state
    default:
      return state
  }
}

export const nhlScoreboardSelectors = {
  getGames(state: State) {
    return state.nhlScoreboard.games
  }
}
