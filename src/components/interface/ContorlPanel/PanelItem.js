import React, {useRef, useState} from "react"
import './PanelItem.css'
import arrow from '../../../assets/img/svg/up-arrow.svg'

function PanelItem({children, title}) {
  const [isOpen, setIsOpen] = useState(false)
  const nodeRef = useRef(null)

  return (
    <div className='panel-item'>
      <div className="panel-item__title" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <img alt='' src={arrow} style={!isOpen ? {transform: 'rotateZ(180deg)'} : null}/>
      </div>
      {isOpen ? <div ref={nodeRef} className="panel-item__container">{children}</div> : null}
    </div>
  )
}

export default PanelItem