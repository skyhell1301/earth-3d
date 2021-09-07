import React from "react"
import PanelItem from "./PanelItem";

function ViewControl() {
  return (
    <PanelItem title='Вид'>
      <label htmlFor="">
        Сетка:
        <input type="checkbox"/>
      </label>
      <label htmlFor="">
        Оси координат:
        <input type="checkbox"/>
      </label>
    </PanelItem>
  )
}

export default ViewControl