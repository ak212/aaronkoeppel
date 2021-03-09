import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

import { NhlGame } from '../reducers/NhlScoreboard'

interface Props {
   game: NhlGame
}

const useStyles = makeStyles((theme: Theme) => ({
   card: {
      height: 85,
      width: 1000,
      background: '#b4c6e9'
   },
   logo: {
      width: 100,
      marginTop: 5
   }
}))

export const NhlGameScore = (props: Props) => {
   const classes = useStyles()

   const homeScoreGreater: boolean = props.game.teams.home.score > props.game.teams.away.score
   const awayScoreGreater: boolean = props.game.teams.away.score > props.game.teams.home.score

   return (
      <Grid item>
         <Card classes={{ root: classes.card }} elevation={3}>
            <Grid container justify="space-between">
               <Grid container style={{ maxWidth: '450px' }}>
                  <CardMedia
                     classes={{ root: classes.logo }}
                     component="img"
                     image={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${props.game.teams.away.team.id}.svg`}
                     title={`${props.game.teams.away.team.name} Logo`}
                  />
                  <Grid container xs justify="center" direction="column">
                     <Typography component="h5" variant="h5" color={homeScoreGreater ? "textSecondary" : "textPrimary"}>
                        {props.game.teams.away.team.name}
                     </Typography>
                     <Typography variant="subtitle1" color={homeScoreGreater ? "textSecondary" : "textPrimary"}>
                        {props.game.teams.away.score}
                     </Typography>
                  </Grid>
               </Grid>
               <Grid container justify="center" alignContent="center" style={{ maxWidth: '100px' }}>
                  {props.game.linescore.currentPeriod !== 0
                     ? `${props.game.linescore.currentPeriodTimeRemaining} - ${props.game.linescore.currentPeriodOrdinal}`
                     : `${props.game.status.detailedState}`}
               </Grid>
               <Grid container style={{ maxWidth: '450px' }}>
                  <Grid container xs justify="center" direction="column">
                     <Typography component="h5" variant="h5" color={awayScoreGreater ? "textSecondary" : "textPrimary"}>
                        {props.game.teams.home.team.name}
                     </Typography>
                     <Typography variant="subtitle1" color={awayScoreGreater ? "textSecondary" : "textPrimary"}>
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
