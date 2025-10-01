import CardMedia from '@mui/material/CardMedia';
import React from 'react';

type Props = {
  size: 'x-small' | 'small' | 'large';
  teamAbbrev: string;
  url: string
};

export const NhlTeamLogo = ({ size, teamAbbrev, url }: Props) => {
  return (
    <CardMedia
      sx={{
        ...(size === 'x-small' && {
          width: 22,
          height: 15,
          margin: '0.25rem',
        }),
        ...(size === 'small' && {
          width: 45,
          height: 30,
          margin: '0.25vh 1vw 0.25vh 1vw',
        }),
        ...(size === 'large' && {
          '@media (min-width: 850px)': {
            width: 90,
            height: 60,
            margin: '0.25rem',
          },
          '@media (max-width: 849px)': {
            width: 60,
            height: 40,
            margin: '0.25rem',
          },
        }),
      }}
      component="img"
      image={url}
      title={`${teamAbbrev} Logo`}
    />
  );
};
