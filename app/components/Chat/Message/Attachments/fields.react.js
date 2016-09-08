import React from 'react'
import classnames from 'classnames'

export default ({ data: fields }) => { // eslint-disable-line react/prop-types
  return (
    <div className='fields'>
      {fields.map(({short, value, title}, i) => (
        <div key={title} className={classnames('field', {short})}>
          <h3>{title || ''}</h3>
          <p>{value || ''}</p>
        </div>
      ))}
    </div>
  )
}
