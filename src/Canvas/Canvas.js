import Styles from "./Canvas.module.css";
import { useRef, useEffect, useState } from "react";

const Canvas = (props) => {
  const ref = useRef();

  const ball1Ref = useRef(createBall(50, 100, 0, 2, 25, "blue"));
  const ball2Ref = useRef(createBall(props.width - 50, 100, 0, 2, 25, "red"));
  const [score1, setScore1] = useState(0); // Счетчик для левого шара
  const [score2, setScore2] = useState(0); // Счетчик для правого шара
  const [isStarted, setIsStarted] = useState(false); // Состояние, отвечающее за старт/стоп

  const [ball1Speed, setBall1Speed] = useState(0);
  const [ball2Speed, setBall2Speed] = useState(0);
  const [ball1Frequency, setBall1Frequency] = useState(1000); // Частота для левого игрока
  const [ball2Frequency, setBall2Frequency] = useState(1000); // Частота для правого игрока

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

  const [leftSmallBalls, setLeftSmallBalls] = useState([]); // Массив для маленьких шаров из левого шара
  const [rightSmallBalls, setRightSmallBalls] = useState([]); // Массив для маленьких шаров из правого шара

  const generateSmallBallLeft = () => {
    setLeftSmallBalls((prevSmallBalls) => {
      const newSmallBall = createBall(
        ball1Ref.current.x + ball1Ref.current.radius,
        ball1Ref.current.y,
        5,
        0,
        10,
        "blue"
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
        "red"
      );
      return [...prevSmallBalls, newSmallBall];
    });
  };

  // Функция для изменения скорости шара
  const updateBallSpeed = (ballRef, newSpeed) => {
    ballRef.current.vy = newSpeed;
  };

  // Обработчик клика на кнопке старт/стоп
  const handleStartStop = () => {
    setIsStarted(!isStarted);
  };

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    // Function to animate all balls
    function animateBalls() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Очистка холста

      // Draw each ball
      ball1Ref.current.draw(ctx);
      // Обновляем скорость шаров в каждой итерации анимации
      ball1Ref.current.y += ball1Ref.current.vy; // Обновляем координату y шара

      ball2Ref.current.draw(ctx);
      ball2Ref.current.y += ball2Ref.current.vy; // Обновляем координату y шара

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

    return () => window.cancelAnimationFrame(animationId);
  }); // Remove handleClick from dependency array

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
  }, [isStarted, ball1Frequency, ball2Frequency]); // Зависимость от isStarted

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
      <div className={Styles.box}>
        <h1 className={Styles.text}>Получено урона: {score1}</h1>
        <p className={Styles.text}>Здоровье: {100 - score1}</p>
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
      />
      <div className={Styles.box}>
        <h1 className={Styles.text}>Получено урона: {score2}</h1>
        <p className={Styles.text}>Здоровье: {100 - score2}</p>
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
