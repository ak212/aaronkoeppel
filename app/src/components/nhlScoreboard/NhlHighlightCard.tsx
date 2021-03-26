import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import GridListTile from '@material-ui/core/GridListTile'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Typography from '@material-ui/core/Typography'
import React from 'react'

import { Highlight, HIGHLIGHT_PLAYBACK_NAME } from '../../store/nhlScoreboard'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: '0 1vw 1vh 0'
  }
})

type Props = {
  highlight: Highlight
}

export const NhlHighlightCard = (props: Props): JSX.Element => {
  const classes = useStyles()
  return (
    <GridListTile key={props.highlight.title}>
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
    </GridListTile>
  )
}
