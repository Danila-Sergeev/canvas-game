import { useState } from "react";
import Styles from "./Popap.module.css";

const Popap = ({ ballRef, handleClosePopap, handleColorChange, ball1Ref }) => {
  // Добавляем props

  return (
    <div className={ball1Ref ? Styles.menuRight : Styles.menuLeft}>
      <h2>Выбор цвета</h2>
      <button
        onClick={() => handleClosePopap(ballRef)} // Передаем ballRef в handleClosePopap
        className={Styles.close}
      >
        x
      </button>
      <div className={Styles.menuBox}>
        <button
          onClick={() =>
            ball1Ref
              ? handleColorChange("blue", ballRef)
              : handleColorChange("red", ballRef)
          }
          className={Styles.colorButton}
          style={{ backgroundColor: ball1Ref ? "blue" : "red" }} // Устанавливаем цвет кнопки
        />
        <button
          onClick={() =>
            ball1Ref
              ? handleColorChange("Yellow", ballRef)
              : handleColorChange("Orange", ballRef)
          }
          className={Styles.colorButton}
          style={{ backgroundColor: ball1Ref ? "Yellow" : "Orange" }} // Устанавливаем цвет кнопки
        />
        <button
          onClick={() =>
            handleColorChange(ball1Ref ? "green" : "Purple", ballRef)
          }
          className={Styles.colorButton}
          style={{ backgroundColor: ball1Ref ? "green" : "Purple" }} // Устанавливаем цвет кнопки
        />
        <button
          onClick={() =>
            handleColorChange(ball1Ref ? "Aqua" : "Silver", ballRef)
          }
          className={Styles.colorButton}
          style={{ backgroundColor: ball1Ref ? "Aqua" : "Silver" }} // Устанавливаем цвет кнопки
        />
        <button
          onClick={() =>
            handleColorChange(ball1Ref ? "Snow" : "SaddleBrown", ballRef)
          }
          className={Styles.colorButton}
          style={{ backgroundColor: ball1Ref ? "Snow" : "SaddleBrown" }} // Устанавливаем цвет кнопки
        />
        <button
          onClick={() =>
            handleColorChange(ball1Ref ? "Lime" : "Fuchsia", ballRef)
          }
          className={Styles.colorButton}
          style={{ backgroundColor: ball1Ref ? "Lime" : "Fuchsia" }} // Устанавливаем цвет кнопки
        />
      </div>
    </div>
  );
};

export default Popap;
