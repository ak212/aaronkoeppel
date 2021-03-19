import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'
import React, { useEffect, useState } from 'react'

import { NhlGame } from '../../store/nhlScoreboard'
import { NhlGameInnerCard } from './NhlGameInnerCard'
import { NhlGameOuterCard } from './NhlGameOuterCard'

interface Props {
  game: NhlGame
  showAllExpanded: boolean
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

export const NhlGameCard = (props: Props): JSX.Element => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (props.showAllExpanded) {
      setExpanded(true)
    } else if (!props.showAllExpanded) {
      setExpanded(false)
    }
  }, [props.showAllExpanded])

  /**
   * On click listener for the card itself to expand or collapse.
   *
   */
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  /**
   * Wrap the card component to make it clickable.
   *
   * @param {JSX.Element} children
   * @returns
   */
  const clickableWrapper = (children: JSX.Element) => {
    return <CardActionArea onClick={handleExpandClick}>{children}</CardActionArea>
  }

  /**
   * Produces the card component.
   *
   * @returns
   */
  const gameScoreCard = () => {
    return (
      <Card classes={{ root: classes.card }}>
        <NhlGameOuterCard game={props.game} />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <NhlGameInnerCard game={props.game} />
        </Collapse>
      </Card>
    )
  }

  return (
    <Grid item>{props.game.linescore.currentPeriod !== 0 ? clickableWrapper(gameScoreCard()) : gameScoreCard()}</Grid>
  )
}
