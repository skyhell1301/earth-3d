import React, {useRef, useState} from "react"
import { CSSTransition } from 'react-transition-group';
import './PanelItem.css'
import arrow from '../../../assets/img/svg/up-arrow.svg'

function PanelItem({children, title}) {
  const [isOpen, setIsOpen] = useState(false)
  const nodeRef = useRef(null)
  // function getContainer() {
  //   return isOpen ?
  //     <CSSTransition in={true}
  //                    timeout={300}
  //                    classNames={'panel-item__container'}
  //                    unmountOnExit
  //     >
  //       <div className="panel-item__container">{children}</div>
  //     </CSSTransition>
  //     : null
  // }

  return (
    <div className='panel-item'>
      <div className="panel-item__title" onClick={()=> setIsOpen(!isOpen)}>
        {title}
        <img alt='' src={arrow} style={!isOpen ? {transform: 'rotateZ(180deg)'} : null}/>
      </div>

      <CSSTransition in={isOpen}
                     timeout={300}
                     classNames={'panel-item__container'}
                     unmountOnExit
                     nodeRef={nodeRef}
      >
        <div ref={nodeRef} className="panel-item__container">{children}</div>
      </CSSTransition>
    </div>
  )
}

export default PanelItem