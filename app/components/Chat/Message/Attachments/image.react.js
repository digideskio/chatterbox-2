import React from 'react'
import { extractImageDimentions } from './helpers'
import ImageLoader from 'react-imageloader'
import Togglable from './togglable.react'

export default ({ url, width, height }) => { // eslint-disable-line react/prop-types
  const { width: parsedWidth, height: parsedHeight } = extractImageDimentions(width, height)
  return (
    <Togglable >
      <div className='bigImage'>
        <ImageLoader src={url} style={{ width: `${parsedWidth}px`, height: `${parsedHeight}px` }} />
      </div>
    </Togglable>
  )
}
