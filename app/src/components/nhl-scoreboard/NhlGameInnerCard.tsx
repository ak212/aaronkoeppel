import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import cloneDeep from 'lodash/cloneDeep';
import uniqueId from 'lodash/uniqueId';
import React, { useState } from 'react';

import { GameGoal, NhlGame, ScoringPlayCode } from '../../store/nhl-scoreboard/nhlScoreboard.types';
import { NhlHighlightCard } from './NhlHighlightCard';
import { NhlTeamLogo } from './NhlTeamLogo';

interface Props {
  game: NhlGame;
}

enum NhlGameCardTab {
  SCORING_PLAYS = 'SCORING_PLAYS',
  HIGHLIGHTS = 'HIGHLIGHTS',
}

export const NhlGameInnerCard = ({ game }: Props): JSX.Element => {
  const [tabPanelValue, setTabPanelValue] = useState<string>(NhlGameCardTab.SCORING_PLAYS);

  /**
   * Filter scoring plays by period.
   *
   * @param {ScoringPlay[]} scoringPlays
   * @param {number} period
   * @returns {ScoringPlay[]}
   */
  const filterScoringPlays = (goals: GameGoal[], period: number): GameGoal[] => {
    return goals.filter(goal => goal.period === period);
  };

  /**
   * Creates display of a scoring play.
   *
   * @param {ScoringPlay} scoringPlay
   * @returns
   */
  const createScoringPlayLine = (goal: GameGoal) => {
    const assists = goal.assists;
    let assistString =
      assists.length === 0 ? 'Unassisted' : `Assists: ${assists[0].name.default} (${assists[0].assistsToDate})`;
    assistString += assists.length === 2 ? ` and ${assists[1].name.default} (${assists[1].assistsToDate})` : '';
    let goalScorer = `${goal.name.default} (${goal.goalsToDate})`;
    goalScorer += goal.strength !== ScoringPlayCode.EVEN ? ` (${goal.strength.toUpperCase()})` : '';

    return (
      <Grid container direction="row" alignContent="center">
        <Typography paragraph style={{ marginTop: '9px' }}>{`${goal.timeInPeriod}`}</Typography>
        <NhlTeamLogo
          size="small"
          teamAbbrev={goal.teamAbbrev}
          url={game.awayTeam.abbrev === goal.teamAbbrev ? game.awayTeam.logo : game.homeTeam.logo}
        />
        <Grid container direction="column" size="auto">
          <Typography variant="subtitle2" style={{ marginBottom: '2px' }}>
            {goalScorer}
          </Typography>
          <Typography variant="caption" style={{ marginBottom: '2px' }}>
            {assistString}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  /**
   * Creates table to show all scoring plays for a period.
   *
   * @param {string} periodText
   * @param {number} period
   * @returns
   */
  const displayScoringPlays = (periodText: string, period: number) => {
    const scoringPlays: GameGoal[] = filterScoringPlays(game.goals || [], period);
    return (
      <Table size="small" aria-label="Scoring Summary" style={{ maxWidth: '750px' }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ borderBottomColor: 'rgb(40, 44, 52)' }}>{periodText}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={uniqueId()}>
            <TableCell component="th" scope="row" style={{ borderBottomWidth: '0px', paddingLeft: '8px' }}>
              {filterScoringPlays(game.goals || [], period).map(createScoringPlayLine)}
              {scoringPlays.length === 0 && (
                <Typography paragraph variant="caption" style={{ marginBottom: '2px' }}>
                  No Goals Scored
                </Typography>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  /**
   * Changes the selected tab.
   *
   * @returns
   */
  const handleChange = (event: React.ChangeEvent<unknown>, newValue: NhlGameCardTab) => {
    setTabPanelValue(newValue);
  };

  // const epgs = cloneDeep(game.content.media.epg);
  // epgs.forEach(epg => {
  //   epg.items = epg.items.map(highlight => {
  //     return { ...highlight, title: epg.title };
  //   });
  // });
  // const highlights: Highlight[] = [
  //   ...epgs
  //     .filter(epg => epg.title === EpgTypes.EXTENDED_HIGHLIGHTS || epg.title === EpgTypes.RECAP)
  //     .flatMap(epg => epg.items),
  //   ...cloneDeep(game.content.highlights.scoreboard.items).sort(
  //     (highlightA: Highlight, highlightB: Highlight) => Number(highlightA.id) - Number(highlightB.id),
  //   ),
  // ];

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
            {game.period > 0 && displayScoringPlays('1st Period', 1)}
            {game.period > 1 && displayScoringPlays('2nd Period', 2)}
            {game.period > 2 && displayScoringPlays('3rd Period', 3)}
            {game.period === 4 && displayScoringPlays('OT', 4)}
            {game.period === 5 && displayScoringPlays('Shootout', 5)}
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
              cols={2}
            >
                <NhlHighlightCard key={uniqueId()} highlight={undefined} />
            </ImageList>
          </div>
        )}
      </CardContent>
    </>
  );
};
