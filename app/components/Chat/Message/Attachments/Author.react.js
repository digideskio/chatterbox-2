import React from 'react'

export default ({ name, link, image, service: { image: serviceImage, name: serviceName } = {} }) => { // eslint-disable-line react/prop-types
  return (
    <div className='author-body'>
      {serviceImage ? <div className='service-image' style={{backgroundImage: `url(${serviceImage})`}} /> : null}
      {serviceName ? <div className='service-name'>{serviceName} |</div> : null}
      {image ? <div className='author-image' style={{backgroundImage: `url(${image})`}} /> : null}
      {name ? <div className='author-name'>{name}</div> : null}
    </div>
  )
}
