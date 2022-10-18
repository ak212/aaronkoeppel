import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import moment from 'moment'
import React from 'react'

import { DetailedGameState, NhlGame } from '../../store/nhlScoreboard'
import { NhlTeamLogo } from './NhlTeamLogo'

interface Props {
  game: NhlGame
}

export const NhlGameOuterCard = (props: Props): JSX.Element => {
  const homeScoreGreater: boolean = props.game.teams.home.score > props.game.teams.away.score
  const awayScoreGreater: boolean = props.game.teams.away.score > props.game.teams.home.score
  const minWidth1000: boolean = useMediaQuery('(min-width:1000px)')
  const maxWidth850: boolean = useMediaQuery('(max-width:850px)')
  const maxWidth620: boolean = useMediaQuery('(max-width:620px)')

  /**
   * Logic to produce middle display depending on if it is pregame, live, or postgame.
   *
   * @returns
   */
  const buildMiddleContainer = () => {
    if (props.game.status.detailedState === DetailedGameState.POSTPONED) {
      return (
        <Grid container justifyContent="center" alignContent="center">
          {props.game.status.detailedState}
        </Grid>
      )
    } else if (props.game.linescore.currentPeriod !== 0) {
      if (props.game.linescore.currentPeriodTimeRemaining === 'END') {
        return (
          <>
            <Grid container justifyContent="center" alignContent="center">
              {props.game.linescore.currentPeriodTimeRemaining} - {props.game.linescore.currentPeriodOrdinal}
            </Grid>
            <Grid container justifyContent="center" alignContent="center">
              {`${maxWidth850 ? '' : 'Intermission'} ${moment
                .utc(props.game.linescore.intermissionInfo.intermissionTimeRemaining * 1000)
                .format('mm:ss')}`}
            </Grid>
          </>
        )
      } else {
        if (props.game.linescore.currentPeriodTimeRemaining === 'Final') {
          return (
            <>
              <Grid container justifyContent="center" alignContent="center">
                {props.game.linescore.currentPeriodTimeRemaining}
              </Grid>
              {(props.game.linescore.currentPeriod === 4 || props.game.linescore.currentPeriod === 5) && (
                <Grid container justifyContent="center" alignContent="center">
                  {props.game.linescore.currentPeriodOrdinal}
                </Grid>
              )}
            </>
          )
        } else {
          return `${props.game.linescore.currentPeriodTimeRemaining} - ${props.game.linescore.currentPeriodOrdinal}`
        }
      }
    } else {
      return moment(props.game.gameDate).format('h:mm A')
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
        <NhlTeamLogo size="large" teamId={props.game.teams.away.team.id} teamName={props.game.teams.away.team.name} />
        <Grid container xs justifyContent="center" direction="column">
          {!maxWidth620 && (
            <Typography variant={maxWidth850 ? 'h6' : 'h5'} color={homeScoreGreater ? 'textSecondary' : 'textPrimary'}>
              {minWidth1000 ? props.game.teams.away.team.name : props.game.teams.away.team.teamName}
            </Typography>
          )}
          <Typography variant="h6" color={homeScoreGreater ? 'textSecondary' : 'textPrimary'}>
            {props.game.teams.away.score}
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
        <Grid container xs justifyContent="center" direction="column">
          {!maxWidth620 && (
            <Typography variant={maxWidth850 ? 'h6' : 'h5'} color={awayScoreGreater ? 'textSecondary' : 'textPrimary'}>
              {minWidth1000 ? props.game.teams.home.team.name : props.game.teams.home.team.teamName}
            </Typography>
          )}
          <Typography variant="h6" color={awayScoreGreater ? 'textSecondary' : 'textPrimary'}>
            {props.game.teams.home.score}
          </Typography>
        </Grid>
        <NhlTeamLogo size="large" teamId={props.game.teams.home.team.id} teamName={props.game.teams.home.team.name} />
      </Grid>
    </Grid>
  )
}
