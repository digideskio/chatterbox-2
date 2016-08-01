import React from 'react'

export default function Text({ text, isPretext = true }) { // eslint-disable-line react/prop-types
  return (
    <div className={`attachment-${isPretext ? 'pretext' : 'text'}`}>
      {text}
    </div>
  )
}
