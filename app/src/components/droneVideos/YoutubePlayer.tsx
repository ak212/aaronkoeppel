import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import React, { useState } from 'react'

const YOUTUBE_IDS = ['m0NUCkFd4cE', 'UZ5npDxJPn0', 'Op0iYsVucP4', 'geAa8QbpvTI']

const Iframe = styled('iframe')(() => ({
  position: 'absolute',
  top: '10vh',
  left: '15%',
  width: '70vw',
  height: '70vh',
  paddingTop: '3%',
}))

const style = {
  position: 'absolute',
  top: '45%',
  background: 'transparent',
  border: 'transparent',
  fontSize: '7.5vw',
  fontWeight: 'bolder',
  textShadow: '2px 2px #363636',
  '&:hover': {
    textShadow: '2px 2px #143272',
  },
} as const

export const YoutubePlayer = (): JSX.Element => {
  const [youtubeIdIndex, setYoutubeIdIndex] = useState<number>(0)

  const onForwardClick = () => {
    let index = 0
    if (youtubeIdIndex !== YOUTUBE_IDS.length - 1) {
      index = youtubeIdIndex + 1
    }

    setYoutubeIdIndex(index)
  }

  const onPreviousClick = () => {
    let index = 0
    if (youtubeIdIndex !== 0) {
      index = youtubeIdIndex - 1
    } else {
      index = YOUTUBE_IDS.length - 1
    }

    setYoutubeIdIndex(index)
  }

  return (
    <Box>
      <Button sx={style} style={{ left: '1%' }} onClick={onPreviousClick}>
        {'<'}
      </Button>
      <Iframe
        title={'youtube videos'}
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_IDS[youtubeIdIndex]}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen={true}
      />
      <Button sx={style} style={{ left: '91%' }} onClick={onForwardClick}>
        {'>'}
      </Button>
    </Box>
  )
}
