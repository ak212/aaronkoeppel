import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

import { Highlight, HIGHLIGHT_PLAYBACK_NAME } from '../../store/nhlScoreboard'

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  }
})

type Props = {
  highlight: Highlight
}

export const NhlHighlightCard = (props: Props): JSX.Element => {
  const classes = useStyles()
  return (
    <Card className={classes.root}>
      <CardMedia
        component="video"
        height="140"
        image={props.highlight.playbacks.find(playback => playback.name === HIGHLIGHT_PLAYBACK_NAME)?.url || ''}
        controls
        title={props.highlight.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h5">
          {props.highlight.title}
        </Typography>
      </CardContent>
    </Card>
  )
}
