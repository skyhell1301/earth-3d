import React, {useState} from "react";
import './TLEParams.css'
import {useSelector} from "react-redux";
import TLE from "tle";

function TLEParams() {

  const [isOpen, setIsOpen] = useState(true)
  const tleString = useSelector(state => state.spacecraft.tle)
  const tle = TLE.parse(tleString)

  function getTLEInterface() {
    if (isOpen) {
      return (
        <div className="tle-params__table">
          <div>
            <div className="tle-params__table-item">КА</div>
            <div className="tle-params__table-item">{tle?.name ? tle.name : 'Нет информации'}</div>
          </div>

          <div>
            <div className="tle-params__table-item">ID</div>
            <div className="tle-params__table-item">{tle?.id}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Класс</div>
            <div className="tle-params__table-item">{tle?.class}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Дата эпохи</div>
            <div className="tle-params__table-item">{tle?.date.toLocaleDateString()}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Время эпохи</div>
            <div className="tle-params__table-item">{tle?.date.toLocaleTimeString()}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Ускорение (виток/д^2)</div>
            <div className="tle-params__table-item">{tle?.fdmm}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Вторая производная (виток/д^3)</div>
            <div className="tle-params__table-item">{tle?.sdmm}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Коэффициент торможения</div>
            <div className="tle-params__table-item">{tle?.drag}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Тип эфемериды</div>
            <div className="tle-params__table-item">{tle?.ephemeris}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Номер элемента</div>
            <div className="tle-params__table-item">{tle?.esn}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Номер (NORAD)</div>
            <div className="tle-params__table-item">{tle?.number}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Наклонение</div>
            <div className="tle-params__table-item">{tle?.inclination}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Долгота восходящего узла</div>
            <div className="tle-params__table-item">{tle?.ascension}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Эксцентриситет</div>
            <div className="tle-params__table-item">{tle?.eccentricity}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Аргумент перицентра</div>
            <div className="tle-params__table-item">{tle?.perigee}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Средняя аномалия</div>
            <div className="tle-params__table-item">{tle?.anomaly}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Частота обращения (об/д)</div>
            <div className="tle-params__table-item">{tle?.motion}</div>
          </div>

          <div>
            <div className="tle-params__table-item">Номер витка на момент эпохи</div>
            <div className="tle-params__table-item">{tle?.revolution}</div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div className='tle-params-container'>
      <div className="tle-params__title">
        <button onClick={() => setIsOpen(!isOpen)} className="tle-params__open-tle">TLE</button>
      </div>
      {getTLEInterface()}
    </div>
  )
}

export default TLEParams