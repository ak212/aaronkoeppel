import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import ImageList from '@mui/material/ImageList'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import {
  EpgTypes,
  Highlight,
  NhlGame,
  ScoringPlay,
  ScoringPlayCode,
  ScoringPlayPlayerType,
} from '../../store/nhlScoreboard'
import { NhlHighlightCard } from './NhlHighlightCard'

interface Props {
  game: NhlGame
}

enum NhlGameCardTab {
  SCORING_PLAYS = 'SCORING_PLAYS',
  HIGHLIGHTS = 'HIGHLIGHTS',
}

export const NhlGameInnerCard = (props: Props): JSX.Element => {
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
          sx={{ width: 45, height: 34.5, margin: '0.25vh 1vw 0.25vh 1vw' }}
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

  const epgs = [...props.game.content.media.epg]
  epgs.forEach(epg => {
    epg.items = epg.items.map(highlight => {
      return { ...highlight, title: epg.title }
    })
  })
  const highlights: Highlight[] = [
    ...epgs
      .filter(epg => epg.title === EpgTypes.EXTENDED_HIGHLIGHTS || epg.title === EpgTypes.RECAP)
      .flatMap(epg => epg.items),
    ...props.game.content.highlights.scoreboard.items.sort(
      (highlightA: Highlight, highlightB: Highlight) => Number(highlightA.id) - Number(highlightB.id),
    ),
  ]

  return (
    <>
      <Paper square>
        <Tabs
          value={tabPanelValue}
          sx={{ background: '#b4c6e9' }}
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
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              overflow: 'hidden',
              margin: '1vh',
            }}
          >
            <ImageList
              sx={{
                flexWrap: 'nowrap',
                // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
                transform: 'translateZ(0)',
              }}
              cols={highlights.length}
            >
              {highlights.map(item => (
                <NhlHighlightCard key={item.id} highlight={item} />
              ))}
            </ImageList>
          </div>
        )}
      </CardContent>
    </>
  )
}
