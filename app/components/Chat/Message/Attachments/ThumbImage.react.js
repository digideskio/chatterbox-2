import React from 'react'

export default ({ url }) => { // eslint-disable-line react/prop-types
  return (
    <div className='thumb-cont'>
      <div className='thumb' style={{backgroundImage: `url(${url})`}}></div>
    </div>
  )
}
