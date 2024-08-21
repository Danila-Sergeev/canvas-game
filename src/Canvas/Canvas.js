import Styles from "./Canvas.module.css";
import { useRef, useEffect, useState } from "react";

const Canvas = (props) => {
  const ref = useRef();

  const ball1Ref = useRef(createBall(50, 100, 0, 0, 25, "blue"));
  const ball2Ref = useRef(createBall(props.width - 50, 100, 0, 0, 25, "red"));
  const [score1, setScore1] = useState(0); // Счетчик для левого шара
  const [score2, setScore2] = useState(0); // Счетчик для правого шара
  const [isStarted, setIsStarted] = useState(false); // Состояние, отвечающее за старт/стоп

  const [ball1Speed, setBall1Speed] = useState(0);
  const [ball2Speed, setBall2Speed] = useState(0);
  const [ball1Frequency, setBall1Frequency] = useState(1000); // Частота для левого игрока
  const [ball2Frequency, setBall2Frequency] = useState(1000); // Частота для правого игрока
  const [leftSmallBalls, setLeftSmallBalls] = useState([]); // Массив для маленьких шаров из левого шара
  const [rightSmallBalls, setRightSmallBalls] = useState([]); // Массив для маленьких шаров из правого шара
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isMenuOpen1, setIsMenuOpen1] = useState(false); // Для первого шара
  const [isMenuOpen2, setIsMenuOpen2] = useState(false); // Для второго шара
  const [selectedColor1, setSelectedColor1] = useState("blue"); // Для первого шара
  const [selectedColor2, setSelectedColor2] = useState("red"); // Для второго шара
  // Функция для открытия/закрытия меню
  // Функция для открытия/закрытия меню
  const toggleMenu = (event, ballRef) => {
    // Получаем координаты клика относительно холста
    const canvasRect = ref.current.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    // Проверяем, был ли клик по шару
    if (ballRef === ball1Ref) {
      const ball1X = ball1Ref.current.x;
      const ball1Y = ball1Ref.current.y;
      const ball1Radius = ball1Ref.current.radius;

      const isClickOnBall1 =
        mouseX >= ball1X - ball1Radius &&
        mouseX <= ball1X + ball1Radius &&
        mouseY >= ball1Y - ball1Radius &&
        mouseY <= ball1Y + ball1Radius;

      if (isClickOnBall1) {
        setIsMenuOpen1(!isMenuOpen1);
      }
    } else {
      const ball2X = ball2Ref.current.x;
      const ball2Y = ball2Ref.current.y;
      const ball2Radius = ball2Ref.current.radius;

      const isClickOnBall2 =
        mouseX >= ball2X - ball2Radius &&
        mouseX <= ball2X + ball2Radius &&
        mouseY >= ball2Y - ball2Radius &&
        mouseY <= ball2Y + ball2Radius;
      if (isClickOnBall2) {
        setIsMenuOpen2(!isMenuOpen2);
      }
    }
  };
  // Функция для выбора цвета
  const handleColorChange1 = (color) => {
    setSelectedColor1(color);
    setIsMenuOpen1(false);
  };

  const handleColorChange2 = (color) => {
    setSelectedColor2(color);
    setIsMenuOpen2(false);
  };
  // Определение createBall вне useEffect
  function createBall(x, y, vx, vy, radius, color) {
    return {
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      radius: radius,
      color: color,
      draw: function (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      },
    };
  }

  const generateSmallBallLeft = () => {
    setLeftSmallBalls((prevSmallBalls) => {
      const newSmallBall = createBall(
        ball1Ref.current.x + ball1Ref.current.radius,
        ball1Ref.current.y,
        5,
        0,
        10,
        selectedColor1
      );
      return [...prevSmallBalls, newSmallBall];
    });
  };

  const generateSmallBallRight = () => {
    setRightSmallBalls((prevSmallBalls) => {
      const newSmallBall = createBall(
        ball2Ref.current.x - ball2Ref.current.radius,
        ball2Ref.current.y,
        -5,
        0,
        10,
        selectedColor2
      );
      return [...prevSmallBalls, newSmallBall];
    });
  };

  // Обработчик клика на кнопке старт/стоп
  const handleStartStop = () => {
    setIsStarted(!isStarted);
  };

  // Функция для изменения скорости шара
  const updateBallSpeed = (ballRef, newSpeed) => {
    // Учитываем текущее направление движения
    if (ballRef.current.vy > 0 && newSpeed < 0) {
      // Если шар двигался вверх, а новая скорость отрицательная,
      // нужно изменить направление движения
      newSpeed = Math.abs(newSpeed); // Делаем скорость положительной
    } else if (ballRef.current.vy < 0 && newSpeed > 0) {
      // Если шар двигался вниз, а новая скорость положительная,
      // нужно изменить направление движения
      newSpeed = -Math.abs(newSpeed); // Делаем скорость отрицательной
    }
    ballRef.current.vy = newSpeed;
  };

  // Обработчик движения мыши
  const handleMouseMove = (event) => {
    const canvasRect = ref.current.getBoundingClientRect();
    const ball = ball1Ref.current;
    setMouseX(event.clientX - canvasRect.left);
    setMouseY(event.clientY - canvasRect.top);

    const distanceX = Math.abs(mouseX - ball.x);
    const distanceY = Math.abs(mouseY - ball.y);
  };

  useEffect(() => {
    const ball = ball1Ref.current;
    /* console.log(mouseY); */
    if (
      (mouseY >= ball.y - ball.radius - 5 && // Отступ от верхней границы (5 пикселей)
        mouseY <= ball.y - ball.radius + 5 && // Отступ от верхней границы (5 пикселей)
        mouseX >= ball.x - ball.radius && // Дополнительная проверка по X для верхней границы
        mouseX <= ball.x + ball.radius) || // Дополнительная проверка по X для верхней границы
      (mouseY >= ball.y + ball.radius - 5 && // Отступ от нижней границы (5 пикселей)
        mouseY <= ball.y + ball.radius + 5 && // Отступ от нижней границы (5 пикселей)
        mouseX >= ball.x - ball.radius && // Дополнительная проверка по X для нижней границы
        mouseX <= ball.x + ball.radius) // Дополнительная проверка по X для нижней границы
    ) {
      // Столкновение с верхней или нижней границей, отталкиваем шар
      ball.vy = -ball.vy;
    }
  }, [ball1Ref.current.y]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    // Function to animate all balls
    function animateBalls() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Очистка холста

      // Draw each ball
      ball1Ref.current.draw(ctx);
      ball2Ref.current.draw(ctx);

      // Обновляем скорость шаров в каждой итерации анимации
      ball1Ref.current.y += ball1Ref.current.vy; // Обновляем координату y шара
      ball2Ref.current.y += ball2Ref.current.vy; // Обновляем координату y шара
      // Проверка столкновения с курсором для каждого шара

      // Проверка столкновения с курсором для каждого шара
      // Передаем mouseX и mouseY в качестве аргументов
      /*  checkCollisionWithCursor(ball2Ref, mouseX, mouseY); */ // Передаем mouseX и mouseY в качестве аргументов

      // Bounce off top and bottom boundaries
      if (
        ball1Ref.current.y - ball1Ref.current.radius < 0 ||
        ball1Ref.current.y + ball1Ref.current.radius > canvas.height
      ) {
        ball1Ref.current.vy = -ball1Ref.current.vy;
      }
      if (
        ball2Ref.current.y - ball2Ref.current.radius < 0 ||
        ball2Ref.current.y + ball2Ref.current.radius > canvas.height
      ) {
        ball2Ref.current.vy = -ball2Ref.current.vy;
      }

      // Draw and animate small balls
      leftSmallBalls.forEach((ball, index) => {
        ball.draw(ctx);
        ball.x += ball.vx;
        if (checkCollision(ball, ball2Ref.current)) {
          // Увеличиваем счет правому шару
          setScore2((prevScore) => prevScore + 1);
          // Удаляем шар из массива
          const newLeftSmallBalls = [...leftSmallBalls];
          newLeftSmallBalls.splice(index, 1);
          setLeftSmallBalls(newLeftSmallBalls);
        }
        // ... (Логика удаления маленьких шаров, которые вылетели за пределы холста)
      });

      rightSmallBalls.forEach((ball, index) => {
        ball.draw(ctx);
        ball.x += ball.vx;
        if (checkCollision(ball, ball1Ref.current)) {
          // Увеличиваем счет левому шару
          setScore1((prevScore) => prevScore + 1);
          // Удаляем шар из массива
          const newRightSmallBalls = [...rightSmallBalls];
          newRightSmallBalls.splice(index, 1);
          setRightSmallBalls(newRightSmallBalls);
        }
      });
      animationId = window.requestAnimationFrame(animateBalls);
    }

    // Start the animation
    animateBalls();

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [
    ball1Speed,
    ball2Speed,
    leftSmallBalls,
    rightSmallBalls,
    selectedColor1,
    selectedColor2,
  ]); // Remove handleClick from dependency array

  useEffect(() => {
    let intervalIdLeft;
    let intervalIdRight;

    if (isStarted) {
      // Запускаем интервалы только если isStarted true
      intervalIdLeft = setInterval(() => {
        generateSmallBallLeft();
      }, ball1Frequency);
      intervalIdRight = setInterval(() => {
        generateSmallBallRight();
      }, ball2Frequency);
    }

    return () => {
      clearInterval(intervalIdLeft);
      clearInterval(intervalIdRight);
    };
  }, [
    isStarted,
    ball1Frequency,
    ball2Frequency,
    selectedColor1,
    selectedColor2,
  ]); // Зависимость от isStarted

  // Функция для проверки столкновения
  function checkCollision(ball1, ball2) {
    const distance = Math.sqrt(
      Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2)
    );
    return distance <= ball1.radius + ball2.radius;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      <button onClick={handleStartStop} className={Styles.startBtn}>
        {isStarted ? "Стоп" : "Старт"}
      </button>
      {isMenuOpen1 && (
        <div className={Styles.menu1}>
          <h2>Выбор цвета</h2>
          <button
            onClick={() => handleColorChange1("blue")}
            className={Styles.colorButton}
            style={{ backgroundColor: "blue" }}
          />
          <button
            onClick={() => handleColorChange1("red")}
            className={Styles.colorButton}
            style={{ backgroundColor: "red" }}
          />
          <button
            onClick={() => handleColorChange1("green")}
            className={Styles.colorButton}
            style={{ backgroundColor: "green" }}
          />
          {/* Добавьте другие цвета по необходимости */}
        </div>
      )}

      {isMenuOpen2 && (
        <div className={Styles.menu2}>
          <h2>Выбор цвета</h2>
          <button
            onClick={() => handleColorChange2("blue")}
            className={Styles.colorButton}
            style={{ backgroundColor: "blue" }}
          />
          <button
            onClick={() => handleColorChange2("red")}
            className={Styles.colorButton}
            style={{ backgroundColor: "red" }}
          />
          <button
            onClick={() => handleColorChange2("green")}
            className={Styles.colorButton}
            style={{ backgroundColor: "green" }}
          />
          {/* Добавьте другие цвета по необходимости */}
        </div>
      )}

      <div className={Styles.box}>
        <h1 className={Styles.text}>Получено урона: {score1}</h1>
        <label htmlFor="ball1-frequency">Скорость левого игрока:</label>
        <input
          type="range"
          id="ball1-speed"
          min="2"
          max="20"
          value={ball1Speed}
          onChange={(e) => {
            setBall1Speed(parseInt(e.target.value));
            updateBallSpeed(ball1Ref, parseInt(e.target.value));
          }}
        />
        <label htmlFor="ball1-frequency">
          Частота выстрелов левого игрока:
        </label>
        <input
          type="range"
          id="ball1-frequency"
          min="100"
          max="1000"
          value={ball1Frequency}
          onChange={(e) => setBall1Frequency(parseInt(e.target.value))}
        />
      </div>
      <canvas
        ref={ref}
        {...props}
        style={{
          backgroundImage: `url("https://klike.net/uploads/posts/2022-09/1662044139_j-17.jpg")`,
        }}
        onMouseMove={handleMouseMove}
        onClick={(event) => {
          // Получаем координаты клика относительно холста
          const canvasRect = ref.current.getBoundingClientRect();
          const mouseX = event.clientX - canvasRect.left;
          const mouseY = event.clientY - canvasRect.top;

          // Проверяем, был ли клик по первому шару
          const ball1X = ball1Ref.current.x;
          const ball1Y = ball1Ref.current.y;
          const ball1Radius = ball1Ref.current.radius;

          const isClickOnBall1 =
            mouseX >= ball1X - ball1Radius &&
            mouseX <= ball1X + ball1Radius &&
            mouseY >= ball1Y - ball1Radius &&
            mouseY <= ball1Y + ball1Radius;

          // Проверяем, был ли клик по второму шару
          const ball2X = ball2Ref.current.x;
          const ball2Y = ball2Ref.current.y;
          const ball2Radius = ball2Ref.current.radius;

          const isClickOnBall2 =
            mouseX >= ball2X - ball2Radius &&
            mouseX <= ball2X + ball2Radius &&
            mouseY >= ball2Y - ball2Radius &&
            mouseY <= ball2Y + ball2Radius;

          if (isClickOnBall1) {
            toggleMenu(event, ball1Ref); // Передаем ball1Ref в toggleMenu
          } else if (isClickOnBall2) {
            toggleMenu(event, ball2Ref); // Передаем ball2Ref в toggleMenu
          }
        }}
      />
      <div className={Styles.box}>
        <h1 className={Styles.text}>Получено урона: {score2}</h1>
        <label htmlFor="ball1-frequency">Скорость правого игрока:</label>
        <input
          type="range"
          id="ball2-speed"
          min="2"
          max="20"
          value={ball2Speed}
          onChange={(e) => {
            setBall2Speed(parseInt(e.target.value));
            updateBallSpeed(ball2Ref, parseInt(e.target.value));
          }}
        />
        <label htmlFor="ball2-frequency">
          Частота выстрелов правого игрока:
        </label>
        <input
          type="range"
          id="ball2-frequency"
          min="100"
          max="1000"
          value={ball2Frequency}
          onChange={(e) => setBall2Frequency(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Canvas;
