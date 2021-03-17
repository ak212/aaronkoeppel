import './YoutubePlayer.css'

import React, { useState } from 'react'

const YOUTUBE_IDS = ['m0NUCkFd4cE', 'UZ5npDxJPn0', 'Op0iYsVucP4', 'geAa8QbpvTI']

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
    <div>
      <button className="video-progression-button" style={{ left: '1%' }} onClick={onPreviousClick}>
        {'<'}
      </button>
      <iframe
        title={'youtube videos'}
        className="video-frame"
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_IDS[youtubeIdIndex]}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen={true}
      />
      <button className="video-progression-button" style={{ left: '91%' }} onClick={onForwardClick}>
        {'>'}
      </button>
    </div>
  )
}
