import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import ImageListItem from '@mui/material/ImageListItem'
import Typography from '@mui/material/Typography'
import uniqueId from 'lodash/uniqueId'
import React from 'react'


type Props = {
  highlight: Highlight
}

export const NhlHighlightCard = (props: Props): JSX.Element => {
  return (
    <ImageListItem key={uniqueId()}>
      <Card sx={{ minWidth: 345, margin: '0 1vw 1vh 0' }}>
        <CardMedia
          component="video"
          height="190"
          src={'https://nhl.com/6340923731112'}
          
          controls
          title={'x'}
        />
        <CardContent style={{ padding: '1vh 0 1vh 0' }}>
          <Typography gutterBottom variant="subtitle2">
            {'x'}
          </Typography>
        </CardContent>
      </Card>
    </ImageListItem>
  )
}
