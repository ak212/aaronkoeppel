import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Tab from '@material-ui/core/Tab'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import React, { useState } from 'react'

import { Highlight, NhlGame, ScoringPlay, ScoringPlayCode, ScoringPlayPlayerType } from '../../store/nhlScoreboard'
import { NhlHighlightCard } from './NhlHighlightCard'

interface Props {
  game: NhlGame
}

enum NhlGameCardTab {
  SCORING_PLAYS = 'SCORING_PLAYS',
  HIGHLIGHTS = 'HIGHLIGHTS'
}

const useStyles = makeStyles(() => ({
  card: {
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
      width: 350
    },
    background: '#b4c6e9',
    boxShadow:
      '0px 3px 3px -2px rgba(255, 255, 255, 0.2),0px 3px 4px 0px rgba(255, 255, 255, 0.14),0px 1px 8px 0px rgba(255, 255, 255, 0.52)'
  },
  logoSmall: {
    width: 45,
    height: 34.5,
    margin: 2.5
  },
  tabs: {
    background: '#b4c6e9'
  }
}))

export const NhlGameInnerCard = (props: Props): JSX.Element => {
  const classes = useStyles()
  const [tabPanelValue, setTabPanelValue] = useState<string>(NhlGameCardTab.SCORING_PLAYS)

  /**
   * Filter scoring plays by period.
   *
   * @param {ScoringPlay[]} scoringPlays
   * @param {number} period
   * @returns {ScoringPlay[]}
   */
  const filterScoringPlays = (scoringPlays: ScoringPlay[], period: number): ScoringPlay[] => {
    return scoringPlays.filter(scoringPlay => scoringPlay.about.period === period)
  }

  /**
   * Creates display of a scoring play.
   *
   * @param {ScoringPlay} scoringPlay
   * @returns
   */
  const createScoringPlayLine = (scoringPlay: ScoringPlay) => {
    const assists = scoringPlay.players.filter(player => player.playerType === ScoringPlayPlayerType.ASSIST)
    let assistString =
      assists.length === 0 ? 'Unassisted' : `Assists: ${assists[0].player.fullName} (${assists[0].seasonTotal})`
    assistString += assists.length === 2 ? ` and ${assists[1].player.fullName} (${assists[1].seasonTotal})` : ''
    let goalScorer = `${scoringPlay.players[0].player.fullName} (${scoringPlay.players[0].seasonTotal})`
    goalScorer +=
      scoringPlay.result.strength.code !== ScoringPlayCode.EVEN
        ? ` (${scoringPlay.result.strength.code.substring(0, 2)})`
        : ''

    return (
      <Grid container direction="row" alignContent="center">
        <Typography paragraph style={{ marginTop: '9px' }}>{`${scoringPlay.about.periodTimeRemaining}`}</Typography>
        <CardMedia
          classes={{ root: classes.logoSmall }}
          component="img"
          image={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${scoringPlay.team.id}.svg`}
          title={`${scoringPlay.team.name} Logo`}
        />
        <Grid container direction="column" xs>
          <Typography variant="subtitle2" style={{ marginBottom: '2px' }}>
            {goalScorer}
          </Typography>
          <Typography variant="caption" style={{ marginBottom: '2px' }}>
            {assistString}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  /**
   * Creates table to show all scoring plays for a period.
   *
   * @param {string} periodText
   * @param {number} period
   * @returns
   */
  const displayScoringPlays = (periodText: string, period: number) => {
    const scoringPlays: ScoringPlay[] = filterScoringPlays(props.game.scoringPlays, period)
    return (
      <Table size="small" aria-label="Scoring Summary" style={{ maxWidth: '750px' }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ borderBottomColor: 'rgb(40, 44, 52)' }}>{periodText}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={'row.name'}>
            <TableCell component="th" scope="row" style={{ borderBottomWidth: '0px', paddingLeft: '8px' }}>
              {filterScoringPlays(props.game.scoringPlays, period).map(createScoringPlayLine)}
              {scoringPlays.length === 0 && (
                <Typography paragraph variant="caption" style={{ marginBottom: '2px' }}>
                  No Goals Scored
                </Typography>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  /**
   * Changes the selected tab.
   *
   * @returns
   */
  const handleChange = (event: React.ChangeEvent<unknown>, newValue: NhlGameCardTab) => {
    setTabPanelValue(newValue)
  }

  return (
    <>
      <Paper square>
        <Tabs
          value={tabPanelValue}
          classes={{ root: classes.tabs }}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          onClick={e => e.stopPropagation()}
        >
          <Tab label="Scoring Plays" value={NhlGameCardTab.SCORING_PLAYS} />
          <Tab label="Highlights" value={NhlGameCardTab.HIGHLIGHTS} />
        </Tabs>
      </Paper>
      <CardContent style={{ padding: '0 0 0 0' }}>
        {tabPanelValue === NhlGameCardTab.SCORING_PLAYS && (
          <>
            {props.game.linescore.currentPeriod > 0 && displayScoringPlays('1st Period', 1)}
            {props.game.linescore.currentPeriod > 1 && displayScoringPlays('2nd Period', 2)}
            {props.game.linescore.currentPeriod > 2 && displayScoringPlays('3rd Period', 3)}
            {props.game.linescore.currentPeriod === 4 && displayScoringPlays('OT', 4)}
            {props.game.linescore.currentPeriod === 5 && displayScoringPlays('Shootout', 5)}
          </>
        )}
        {tabPanelValue === NhlGameCardTab.HIGHLIGHTS && (
          <Grid container justify="center" alignItems="center" direction="row" style={{ overflowX: 'auto' }}>
            {props.game.content.highlights.scoreboard.items
              .sort((highlightA: Highlight, highlightB: Highlight) => Number(highlightA.id) - Number(highlightB.id))
              .map(item => (
                <NhlHighlightCard highlight={item} />
              ))}
          </Grid>
        )}
      </CardContent>
    </>
  )
}
