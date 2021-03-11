import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import moment from 'moment'
import React from 'react'

import { NhlGame } from '../reducers/NhlScoreboard'

interface Props {
  game: NhlGame
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    height: 85,
    '@media (min-width: 1280px)': {
      width: 1000
    },
    '@media (max-width: 1279px)': {
      width: 800
    },
    '@media (max-width: 1000px)': {
      width: 650
    },
    '@media (max-width: 850px)': {
      width: 500
    },
    '@media (max-width: 620px)': {
      width: 250
    },
    background: '#b4c6e9',
    boxShadow:
      '0px 3px 3px -2px rgba(255, 255, 255, 0.2),0px 3px 4px 0px rgba(255, 255, 255, 0.14),0px 1px 8px 0px rgba(255, 255, 255, 0.52)'
  },
  teamContainer: {
    '@media (min-width: 1280px)': {
      maxWidth: '450px'
    },
    '@media (max-width: 1279px)': {
      maxWidth: '350px'
    },
    '@media (max-width: 1000px)': {
      maxWidth: '275px'
    },
    '@media (max-width: 850px)': {
      maxWidth: '225px'
    },
    '@media (max-width: 620px)': {
      maxWidth: '90px'
    },
  },
  middleContainer: {
    '@media (min-width: 850px)': {
      maxWidth: '100px'
    },
    '@media (max-width: 849px)': {
      maxWidth: '50px'
    }
  },
  logo: {
    '@media (min-width: 850px)': {
      width: 90,
      height: 70,
      margin: 2.5
    },
    '@media (max-width: 849px)': {
      width: 80,
      height: 62,
      margin: 2.5
    },
    '@media (max-width: 620px)': {
      width: 60,
      height: 46,
      margin: 2.5
    },
  }
}))

export const NhlGameScore = (props: Props) => {
  const classes = useStyles()

  const homeScoreGreater: boolean = props.game.teams.home.score > props.game.teams.away.score
  const awayScoreGreater: boolean = props.game.teams.away.score > props.game.teams.home.score
  const minWidth1000: boolean = useMediaQuery('(min-width:1000px)')
  const maxWidth850: boolean = useMediaQuery('(max-width:850px)')
  const maxWidth620: boolean = useMediaQuery('(max-width:620px)')

  const buildMiddleContainer = () => {
    if (props.game.linescore.currentPeriod !== 0) {
      if (props.game.linescore.currentPeriodTimeRemaining === 'END') {
        return (
          <>
            <Grid container justify="center" alignContent="center">
              {props.game.linescore.currentPeriodTimeRemaining} - {props.game.linescore.currentPeriodOrdinal}
            </Grid>
            <Grid container justify="center" alignContent="center">
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
              <Grid container justify="center" alignContent="center">
                {props.game.linescore.currentPeriodTimeRemaining}
              </Grid>
              {props.game.linescore.currentPeriod === 4 && (
                <Grid container justify="center" alignContent="center">
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
    <Grid item>
      <Card classes={{ root: classes.card }}>
        <Grid container justify="space-between" alignContent="center" style={{ height: '100%'}}>
          <Grid container classes={{ root: classes.teamContainer }}>
            <CardMedia
              classes={{ root: classes.logo }}
              component="img"
              image={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${props.game.teams.away.team.id}.svg`}
              title={`${props.game.teams.away.team.name} Logo`}
            />
            <Grid container xs justify="center" direction="column">
              {!maxWidth620 && <Typography variant={maxWidth850 ? "h6" : "h5"} color={homeScoreGreater ? 'textSecondary' : 'textPrimary'}>
                {minWidth1000 ? props.game.teams.away.team.name : props.game.teams.away.team.teamName}
              </Typography>}
              <Typography variant="h6" color={homeScoreGreater ? 'textSecondary' : 'textPrimary'}>
                {props.game.teams.away.score}
              </Typography>
            </Grid>
          </Grid>
          <Grid container justify="center" alignContent="center" classes={{ root: classes.middleContainer }}>
            {buildMiddleContainer()}
          </Grid>
          <Grid container classes={{ root: classes.teamContainer }}>
            <Grid container xs justify="center" direction="column">
              {!maxWidth620 && <Typography variant={maxWidth850 ? "h6" : "h5"} color={awayScoreGreater ? 'textSecondary' : 'textPrimary'}>
                {minWidth1000 ? props.game.teams.home.team.name : props.game.teams.home.team.teamName}
              </Typography>}
              <Typography variant="h6" color={awayScoreGreater ? 'textSecondary' : 'textPrimary'}>
                {props.game.teams.home.score}
              </Typography>
            </Grid>
            <CardMedia
              classes={{ root: classes.logo }}
              component="img"
              image={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${props.game.teams.home.team.id}.svg`}
              title={`${props.game.teams.home.team.name} Logo`}
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}
