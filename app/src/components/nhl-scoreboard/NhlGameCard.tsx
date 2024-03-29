import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import React, { useEffect, useState } from 'react'

import { AbstractGameState, NhlGame } from '../../store/nhl-scoreboard'
import { NhlGameInnerCard } from './NhlGameInnerCard'
import { NhlGameOuterCard } from './NhlGameOuterCard'

interface Props {
  game: NhlGame
  showAllExpanded: boolean
}

export const NhlGameCard = (props: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false)
  const canExpand: boolean =
    props.game.status.abstractGameState === AbstractGameState.LIVE ||
    props.game.status.abstractGameState === AbstractGameState.FINAL

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
      <Card
        sx={{
          '@media (min-width: 1280px)': {
            width: 1000,
          },
          '@media (max-width: 1279px)': {
            width: 800,
          },
          '@media (max-width: 1000px)': {
            width: 650,
          },
          '@media (max-width: 850px)': {
            width: 500,
          },
          '@media (max-width: 620px)': {
            width: 350,
          },
          background: '#b4c6e9',
          boxShadow:
            '0px 3px 3px -2px rgba(255, 255, 255, 0.2),0px 3px 4px 0px rgba(255, 255, 255, 0.14),0px 1px 8px 0px rgba(255, 255, 255, 0.52)',
        }}
      >
        <NhlGameOuterCard game={props.game} />
        <Collapse in={canExpand && expanded} timeout="auto" unmountOnExit>
          <NhlGameInnerCard game={props.game} />
        </Collapse>
      </Card>
    )
  }

  return (
    <Grid item>
      {props.game.status.abstractGameState !== AbstractGameState.PREVIEW
        ? clickableWrapper(gameScoreCard())
        : gameScoreCard()}
    </Grid>
  )
}
