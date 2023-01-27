import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import uniqueId from 'lodash/uniqueId'
import React from 'react'

interface Props {
  title: string
  image: string
}

export const ToolCard = ({ title, image }: Props) => {
  return (
    <Grid key={uniqueId()} item xs>
      <Grid container direction={'column'} sx={{ width: '8rem' }}>
        <Grid sx={{ justifyContent: 'center', display: 'grid' }}>
          <Grid
            sx={{
              minHeight: '100px',
              maxWidth: '70px',
              alignItems: 'center',
              display: 'grid',
              marginBottom: '1rem',
            }}
          >
            <CardMedia component="img" image={image} title={title} sx={{ objectFit: 'contain' }} />
          </Grid>
          <Typography variant="h6" fontWeight="600" color="white">
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
