import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { format, formatDate } from 'date-fns/format';
import { secondsToMinutes } from 'date-fns/secondsToMinutes';
import React from 'react';

import { NhlTeamLogo } from './NhlTeamLogo';
import { NhlGame, GameState } from '../../store/nhl-scoreboard/nhlScoreboard.types';
import { Box, Paper, Stack } from '@mui/material';

interface Props {
  game: NhlGame;
}

const formatIntermissionTime = (seconds: number) => {
  const minutes = secondsToMinutes(seconds);
  const remainingSeconds = seconds - 60 * minutes;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const NhlGameOuterCard = ({ game }: Props): JSX.Element => {
  const homeScoreGreater: boolean = game.homeTeam.score > game.awayTeam.score;
  const awayScoreGreater: boolean = game.awayTeam.score > game.homeTeam.score;

  return (
    <Paper
      elevation={1}
      sx={{
        bgcolor: 'white',
        border: 1,
        borderColor: 'grey.300',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        p: 2,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Away team side */}
        <Grid
          container
          size={5}
          alignItems="center"
          justifyContent="space-between"
          sx={{ color: awayScoreGreater ? 'inherit' : 'text.secondary' }}
        >
          {/* Left logo (desktop only) */}
          <Grid
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              p: 0,
            }}
          >
            <NhlTeamLogo size="large" teamAbbrev={game.awayTeam.abbrev} url={game.awayTeam.logo} />
          </Grid>

          {/* Team name/abbr + mobile logo */}
          <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, p: 0 }}>
              <NhlTeamLogo size="large" teamAbbrev={game.awayTeam.abbrev} url={game.awayTeam.logo} />
            </Box>
            <Grid>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: { xs: 'none', lg: 'block' } }}>
                {game.awayTeam.name.default}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  display: { xs: 'flex', lg: 'none' },
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {game.awayTeam.abbrev}
              </Typography>
            </Grid>
          </Grid>

          {/* Away score */}
          <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {game.awayTeam.score !== undefined ? game.awayTeam.score : ''}
            </Typography>
          </Grid>
        </Grid>

        {/* Middle info column */}
        <Grid
          size="grow"
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {game.gameState === GameState.FUTURE && (
            <Typography variant="body2">{formatDate(game.startTimeUTC, 'p')}</Typography>
          )}
          {game.gameState === GameState.PREGAME && (
            <Typography variant="body2">Pregame</Typography>
          )}
          {game.gameState === GameState.LIVE && (
            <>
              <Typography variant="body2">
                {game.clock?.inIntermission
                  ? `Intermission ${game.period}`
                  : game.period! < 4
                    ? `Period ${game.period}`
                    : 'OT'}
              </Typography>
              <Typography variant="body2">{game.clock?.timeRemaining}</Typography>
            </>
          )}
          {game.gameState === GameState.FINAL && (
            <Typography variant="body2">Final{game.period === 4 && '/OT'}</Typography>
          )}
        </Grid>

        {/* Home team side */}
        <Grid
          container
          size={5}
          alignItems="center"
          justifyContent="space-between"
          sx={{ color: homeScoreGreater ? 'inherit' : 'text.secondary' }}
        >
          {/* Home score */}
          <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {game.homeTeam.score !== undefined ? game.homeTeam.score : ''}
            </Typography>
          </Grid>

          {/* Team name/abbr + mobile logo */}
          <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, p: 0 }}>
              <NhlTeamLogo size="large" teamAbbrev={game.homeTeam.abbrev} url={game.homeTeam.logo} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', display: { xs: 'none', lg: 'block' } }}>
              {game.homeTeam.name.default}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                display: { xs: 'flex', lg: 'none' },
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {game.homeTeam.abbrev}
            </Typography>
          </Grid>

          {/* Right logo (desktop only) */}
          <Grid
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              p: 0,
            }}
          >
            <NhlTeamLogo size="large" teamAbbrev={game.homeTeam.abbrev} url={game.homeTeam.logo} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
