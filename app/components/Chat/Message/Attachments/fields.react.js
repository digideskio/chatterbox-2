import React from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import uuid from 'node-uuid'

export default ({ data: fields }) => { // eslint-disable-line react/prop-types
  console.info('FIELDS', fields)
  return (
    <div className='fields'>
      {_.map(fields, (field, i) => {
        return (
          <div key={uuid.v1()} className={classnames('field', {short: field.short})}>
            <h3>{field.title || ''}</h3>
            <p>{field.value || ''}</p>
          </div>
        )
      })}
    </div>
  )
}
