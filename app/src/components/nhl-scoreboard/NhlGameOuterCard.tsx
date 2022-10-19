import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import format from 'date-fns/format'
import secondsToMinutes from 'date-fns/secondsToMinutes'
import React from 'react'

import { DetailedGameState, NhlGame } from '../../store/nhl-scoreboard'
import { NhlTeamLogo } from './NhlTeamLogo'

interface Props {
  game: NhlGame
}

const formatIntermissionTime = (seconds: number) => {
  const minutes = secondsToMinutes(seconds)
  const remainingSeconds = seconds - 60 * minutes
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const NhlGameOuterCard = ({ game }: Props): JSX.Element => {
  const homeScoreGreater: boolean = game.teams.home.score > game.teams.away.score
  const awayScoreGreater: boolean = game.teams.away.score > game.teams.home.score
  const minWidth1000: boolean = useMediaQuery('(min-width:1000px)')
  const maxWidth850: boolean = useMediaQuery('(max-width:850px)')
  const maxWidth620: boolean = useMediaQuery('(max-width:620px)')

  /**
   * Logic to produce middle display depending on if it is pregame, live, or postgame.
   *
   * @returns
   */
  const buildMiddleContainer = () => {
    if (game.status.detailedState === DetailedGameState.POSTPONED) {
      return (
        <Grid container justifyContent="center" alignContent="center">
          {game.status.detailedState}
        </Grid>
      )
    } else if ([DetailedGameState.SCHEDULED, DetailedGameState.PRE_GAME].includes(game.status.detailedState)) {
      return format(new Date(game.gameDate), 'h:mm aa')
    } else if (game.linescore.currentPeriod !== 0) {
      if (game.linescore.currentPeriodTimeRemaining === 'END') {
        return (
          <>
            <Grid container justifyContent="center" alignContent="center">
              {game.linescore.currentPeriodTimeRemaining} - {game.linescore.currentPeriodOrdinal}
            </Grid>
            <Grid container justifyContent="center" alignContent="center">
              {`${maxWidth850 ? '' : 'Intermission'} ${formatIntermissionTime(
                game.linescore.intermissionInfo.intermissionTimeRemaining,
              )}`}
            </Grid>
          </>
        )
      } else {
        if (game.linescore.currentPeriodTimeRemaining === 'Final') {
          return (
            <>
              <Grid container justifyContent="center" alignContent="center">
                {game.linescore.currentPeriodTimeRemaining}
              </Grid>
              {(game.linescore.currentPeriod === 4 || game.linescore.currentPeriod === 5) && (
                <Grid container justifyContent="center" alignContent="center">
                  {game.linescore.currentPeriodOrdinal}
                </Grid>
              )}
            </>
          )
        } else {
          return `${game.linescore.currentPeriodTimeRemaining} - ${game.linescore.currentPeriodOrdinal}`
        }
      }
    } else {
      return format(new Date(game.gameDate), 'h:mm aa')
    }
  }

  return (
    <Grid container justifyContent="space-between" alignContent="center" style={{ height: '100%' }}>
      <Grid
        container
        sx={{
          '@media (min-width: 1280px)': {
            maxWidth: '450px',
          },
          '@media (max-width: 1279px)': {
            maxWidth: '350px',
          },
          '@media (max-width: 1000px)': {
            maxWidth: '275px',
          },
          '@media (max-width: 850px)': {
            maxWidth: '225px',
          },
          '@media (max-width: 620px)': {
            maxWidth: '140px',
          },
        }}
      >
        <NhlTeamLogo size="large" teamId={game.teams.away.team.id} teamName={game.teams.away.team.name} />
        <Grid container item xs justifyContent="center" direction="column">
          {!maxWidth620 && (
            <Typography variant={maxWidth850 ? 'h6' : 'h5'} color={homeScoreGreater ? 'textSecondary' : 'textPrimary'}>
              {minWidth1000 ? game.teams.away.team.name : game.teams.away.team.teamName}
            </Typography>
          )}
          <Typography variant="h6" color={homeScoreGreater ? 'textSecondary' : 'textPrimary'}>
            {game.teams.away.score}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        sx={{
          '@media (min-width: 850px)': {
            maxWidth: '100px',
          },
          '@media (max-width: 849px)': {
            maxWidth: '50px',
          },
        }}
      >
        {buildMiddleContainer()}
      </Grid>
      <Grid
        container
        sx={{
          '@media (min-width: 1280px)': {
            maxWidth: '450px',
          },
          '@media (max-width: 1279px)': {
            maxWidth: '350px',
          },
          '@media (max-width: 1000px)': {
            maxWidth: '275px',
          },
          '@media (max-width: 850px)': {
            maxWidth: '225px',
          },
          '@media (max-width: 620px)': {
            maxWidth: '140px',
          },
        }}
      >
        <Grid container item xs justifyContent="center" direction="column">
          {!maxWidth620 && (
            <Typography variant={maxWidth850 ? 'h6' : 'h5'} color={awayScoreGreater ? 'textSecondary' : 'textPrimary'}>
              {minWidth1000 ? game.teams.home.team.name : game.teams.home.team.teamName}
            </Typography>
          )}
          <Typography variant="h6" color={awayScoreGreater ? 'textSecondary' : 'textPrimary'}>
            {game.teams.home.score}
          </Typography>
        </Grid>
        <NhlTeamLogo size="large" teamId={game.teams.home.team.id} teamName={game.teams.home.team.name} />
      </Grid>
    </Grid>
  )
}
