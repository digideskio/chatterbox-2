import React from 'react'
import VideoPlayer from 'react-player'

export default ({ url, width, height, type }) => { // eslint-disable-line react/prop-types
  width = width > 500 ? 500 : width
  height = height > 375 ? 375 : height
  return (
    <div className='video'>
      <VideoPlayer className='video-player' url={url} width={`${width}px`} height={`${height}px`} controls />
    </div>
  )
}
