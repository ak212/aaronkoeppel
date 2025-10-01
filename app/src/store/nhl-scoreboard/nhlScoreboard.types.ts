export type NhlScoreboard = {
  games: NhlGame[];
};

export interface GameWeek {
  date: string;
  dayAbbrev: string;
  numberOfGames: number;
}

export type NhlScoreboardResponse = {
  games: NhlGame[];
  gameWeek: GameWeek[];
};

export interface TvBroadcasts {
  id: number;
  market: string;
  countryCode: string;
  network: string;
  sequenceNumber: number;
}

export interface GameClock {
  timeRemaining: string;
  secondsRemaining: number;
  running: boolean;
  inIntermission: boolean;
}

export interface GameAssist {
  playerId: number;
  name: {
    default: string;
  };
  assistsToDate: number;
}
export interface GameGoal {
  period: number;
  periodDescriptor: {
    number: number;
    periodType: string;
    maxRegulationPeriods: number;
  };
  timeInPeriod: string;
  playerId: number;
  name: {
    default: string;
  };
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  goalModifier: string;
  assists: GameAssist[];
  mugshot: string;
  teamAbbrev: string;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  strength: string;
  highlightClipSharingUrl: string;
  highlightClip: number;
  discreteClip: number;
}

export enum GameState {
  LIVE = 'LIVE',
  FINAL = 'FINAL',
  FUTURE = 'FUT',
  PREGAME = 'PRE',
}

export interface GameTeam {
  id: number;
  name: {
    default: string;
  };
  abbrev: string;
  score: number;
  sog: number;
  logo: string;
}

export interface PregameTeamLeader {
  id: number;
  firstName: { default: string };
  lastName: { default: string };
  headshot: string;
  teamAbbrev: string;
  sweaterNumber: number;
  position: string;
  category: string;
  value: number;
}

export type NhlGame = {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  venue: {
    default: string;
  };
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  tvBroadcasts: TvBroadcasts[];
  gameState: GameState;
  gameScheduleState: string;
  awayTeam: GameTeam;
  homeTeam: GameTeam;
  gameCenterLink: string;
  threeMinRecap?: string;
  condensedGame?: string;
  clock?: GameClock;
  neutralSite: boolean;
  venueTimezone: string;
  period?: number;
  periodDescriptor?: {
    number: number;
    periodType: string;
    maxRegulationPeriods: number;
  };
  gameOutcome?: {
    lastPeriodType: string;
  };
  goals?: GameGoal[];
  teamLeaders: PregameTeamLeader[];
};

export enum ScoringPlayCode {
  PPG = 'pp',
  SHG = 'sh',
  EVEN = 'ev',
}

export enum ScoringPlayPlayerType {
  SCORER = 'Scorer',
  ASSIST = 'Assist',
  GOALIE = 'Goalie',
}

export const initialScoreboardState = {
  games: [] as NhlGame[],
};
