import React from "react";
import './TLEParams.css'

function TLEParams({tle}) {
  return(
    <div className='tle-params-container'>
      <div className="tle-params__table">
        <div className="tle-params__table-column">
          <div className="tle-params__table-item">КА</div>
          <div className="tle-params__table-item">ID</div>
          <div className="tle-params__table-item">Класс</div>
          <div className="tle-params__table-item">Дата эпохи</div>
          <div className="tle-params__table-item">Время эпохи</div>
          <div className="tle-params__table-item">Ускорение [виток/д^2]</div>
          <div className="tle-params__table-item">Вторая производная [виток/д^3]</div>
          <div className="tle-params__table-item">Коэффициент торможения</div>
          <div className="tle-params__table-item">Тип эфемериды</div>
          <div className="tle-params__table-item">Номер элемента</div>
          <div className="tle-params__table-item">Номер (NORAD)</div>
          <div className="tle-params__table-item">Наклонение</div>
          <div className="tle-params__table-item">Долгота восходящего узла</div>
          <div className="tle-params__table-item">Эксцентриситет</div>
          <div className="tle-params__table-item">Аргумент перицентра</div>
          <div className="tle-params__table-item">Средняя аномалия</div>
          <div className="tle-params__table-item">Частота обращения (об/д)</div>
          <div className="tle-params__table-item">Номер витка на момент эпохи</div>
        </div>
        <div className="tle-params__table-column">
          <div className="tle-params__table-item">{tle?.name ? tle.name : 'Нет информации'}</div>
          <div className="tle-params__table-item">{tle?.id}</div>
          <div className="tle-params__table-item">{tle?.class}</div>
          <div className="tle-params__table-item">{tle?.date.toLocaleDateString()}</div>
          <div className="tle-params__table-item">{tle?.date.toLocaleTimeString()}</div>
          <div className="tle-params__table-item">{tle?.fdmm}</div>
          <div className="tle-params__table-item">{tle?.sdmm}</div>
          <div className="tle-params__table-item">{tle?.drag}</div>
          <div className="tle-params__table-item">{tle?.ephemeris}</div>
          <div className="tle-params__table-item">{tle?.esn}</div>
          <div className="tle-params__table-item">{tle?.number}</div>
          <div className="tle-params__table-item">{tle?.inclination}</div>
          <div className="tle-params__table-item">{tle?.ascension}</div>
          <div className="tle-params__table-item">{tle?.eccentricity}</div>
          <div className="tle-params__table-item">{tle?.perigee}</div>
          <div className="tle-params__table-item">{tle?.anomaly}</div>
          <div className="tle-params__table-item">{tle?.motion}</div>
          <div className="tle-params__table-item">{tle?.revolution}</div>
        </div>
      </div>

    </div>
  )
}

export default TLEParams