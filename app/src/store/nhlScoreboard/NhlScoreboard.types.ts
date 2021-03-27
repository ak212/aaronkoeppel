export type NhlScoreboard = {
  games: NhlGame[]
}

export type NhlScoreboardResponse = {
  dates: NhlGameDay[]
  totalGames: number
}

export type NhlGameDay = {
  games: NhlGame[]
  date: Date
  totalGames: number
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
  content: GameMedia
}

type GameMedia = {
  highlights: Highlights
  media: Media
}

type Media = {
  epg: EPG[]
}

type EPG = {
  title: EpgTypes
  items: Highlight[]
}

export enum EpgTypes {
  EXTENDED_HIGHLIGHTS = 'Extended Highlights',
  RECAP = 'Recap'
}

type Highlights = {
  scoreboard: Scoreboard
}

type Scoreboard = {
  title: string
  topicList: string
  items: Highlight[]
}

export type Highlight = {
  type: string
  id: string
  date: Date
  title: string
  blurb: string
  description: string
  duration: string
  image: HighlightImage
  playbacks: HighlightPlayback[]
}

export const HIGHLIGHT_PLAYBACK_NAME = 'FLASH_1800K_896x504'

type HighlightPlayback = {
  name: string
  width: string
  height: string
  url: string
}

type HighlightImage = {
  cuts: ImageCut[]
}

type ImageCut = {
  width: number
  height: number
  src: string
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

export enum ScoringPlayCode {
  PPG = 'PPG',
  SHG = 'SHG',
  EVEN = 'EVEN'
}

type ScoringPlayPlayers = {
  player: ScoringPlayPlayer
  playerType: ScoringPlayPlayerType
  seasonTotal?: number
}

export enum ScoringPlayPlayerType {
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
  FINAL = 'Final',
  PREVIEW = 'Preview'
}

export enum DetailedGameState {
  IN_PROGRESS = 'In Progress',
  IN_PROGRESS_CRITICAL = 'In Progress - Critical',
  FINAL = 'Final',
  POSTPONED = 'Postponed'
}

export const isGameLive = (game: NhlGame): boolean => {
  return game.status.abstractGameState === AbstractGameState.LIVE
}

export const initialScoreboardState = {
  games: []
}
