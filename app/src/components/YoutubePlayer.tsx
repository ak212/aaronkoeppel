import './YoutubePlayer.css'

import React from 'react'

const YOUTUBE_IDS = ["m0NUCkFd4cE", "UZ5npDxJPn0", "Op0iYsVucP4", "geAa8QbpvTI"]

interface State {
   youtubeIdIndex: number
}

interface Props {}

export default class YoutubePlayer extends React.Component<Props, State> {
   constructor(props: Props) {
      super(props)

      this.state = {
         youtubeIdIndex: 0
      }
   }

   private onForwardClick = () => {
      this.setState((prevState) => {
         let index = 0
         if (prevState.youtubeIdIndex !== YOUTUBE_IDS.length - 1) {
            index = prevState.youtubeIdIndex + 1
         }

         return {
            youtubeIdIndex: index
         }
      })
   }

   private onPreviousClick = () => {
      this.setState((prevState) => {
         let index = 0
         if (prevState.youtubeIdIndex !== 0) {
            index = prevState.youtubeIdIndex - 1
         } else {
            index = YOUTUBE_IDS.length - 1
         }

         return {
            youtubeIdIndex: index
         }
      })
   }

   public render = () => {
      return (
         <div className='video'>
            <button
               className='video-progression-button'
               style={{ left: "1%" }}
               onClick={this.onPreviousClick}
            >
               {"<"}
            </button>
            <iframe
               title={"youtube videos"}
               className='video-frame'
               src={`https://www.youtube-nocookie.com/embed/${
                  YOUTUBE_IDS[this.state.youtubeIdIndex]
               }`}
               frameBorder='0'
               allow='autoplay; encrypted-media'
               allowFullScreen={true}
            />
            <button
               className='video-progression-button'
               style={{ left: "91%" }}
               onClick={this.onForwardClick}
            >
               {">"}
            </button>
         </div>
      )
   }
}
