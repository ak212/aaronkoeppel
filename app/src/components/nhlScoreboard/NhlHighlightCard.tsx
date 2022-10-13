import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import ImageListItem from '@mui/material/ImageListItem'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import React from 'react'

import { Highlight, HIGHLIGHT_PLAYBACK_NAME } from '../../store/nhlScoreboard'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: '0 1vw 1vh 0',
  },
})

type Props = {
  highlight: Highlight
}

export const NhlHighlightCard = (props: Props): JSX.Element => {
  const classes = useStyles()
  return (
    <ImageListItem key={props.highlight.title}>
      <Card className={classes.root}>
        <CardMedia
          component="video"
          height="190"
          image={props.highlight.playbacks.find(playback => playback.name === HIGHLIGHT_PLAYBACK_NAME)?.url || ''}
          controls
          title={props.highlight.title}
        />
        <CardContent style={{ padding: '1vh 0 1vh 0' }}>
          <Typography gutterBottom variant="subtitle2">
            {props.highlight.title}
          </Typography>
        </CardContent>
      </Card>
    </ImageListItem>
  )
}
