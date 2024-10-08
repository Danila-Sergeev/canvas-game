import Popap from "../components/Popap/Popap";
import Styles from "./Canvas.module.css";
import { useRef, useEffect, useState, useCallback } from "react";

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
  const [leftSmallBalls, setLeftSmallBalls] = useState([]); // Массив для маленьких шаров из левого шара
  const [rightSmallBalls, setRightSmallBalls] = useState([]); // Массив для маленьких шаров из правого шара
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isMenuOpen1, setIsMenuOpen1] = useState(false); // Для первого шара
  const [isMenuOpen2, setIsMenuOpen2] = useState(false); // Для второго шара
  const [selectedColor1, setSelectedColor1] = useState("blue"); // Для первого шара
  const [selectedColor2, setSelectedColor2] = useState("red"); // Для второго шара

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

  //Функция генерации маленьких шаров
  const generateSmallBall = (ballRef, selectedColor) => {
    if (ballRef === ball1Ref) {
      setLeftSmallBalls((prevSmallBalls) => {
        const newSmallBall = createBall(
          ballRef.current.x + ballRef.current.radius,
          ballRef.current.y,
          5,
          0,
          10,
          selectedColor
        );
        return [...prevSmallBalls, newSmallBall];
      });
    } else {
      setRightSmallBalls((prevSmallBalls) => {
        const newSmallBall = createBall(
          ballRef.current.x - ballRef.current.radius,
          ballRef.current.y,
          -5,
          0,
          10,
          selectedColor
        );
        return [...prevSmallBalls, newSmallBall];
      });
    }
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
  const handleColorChange = (color, ballRef) => {
    if (ballRef === ball1Ref) {
      setSelectedColor1(color);
      setIsMenuOpen1(false);
    }
    if (ballRef === ball2Ref) {
      setSelectedColor2(color);
      setIsMenuOpen2(false);
    }
  };

  //Событие клика на игрока открытие модального окна
  const onElementClick = (event) => {
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
  };

  // Обработчик закрытия попап
  const handleClosePopap = (ballRef) => {
    ballRef === ball1Ref
      ? setIsMenuOpen1(!isMenuOpen1)
      : setIsMenuOpen2(!isMenuOpen2);
  };

  // Функция для проверки столкновения
  function checkCollision(ball1, ball2) {
    const distance = Math.sqrt(
      Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2)
    );
    return distance <= ball1.radius + ball2.radius;
  }

  // Функция для проверки столкновения с курсором
  function checkCollisionMouse(ball, mouseX, mouseY) {
    const distance = Math.sqrt(
      Math.pow(ball.x - mouseX, 2) + Math.pow(ball.y - mouseY, 2)
    );
    return distance <= ball.radius;
  }

  // Обработчик движения мыши
  const handleMouseMove = (event) => {
    //Считываем координаты курсора в поле canvas
    const canvasRect = ref.current.getBoundingClientRect();
    setMouseX(event.clientX - canvasRect.left);
    setMouseY(event.clientY - canvasRect.top);
  };

  // Функция для анимирования всех шаров
  const animateBalls = useCallback(
    (ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Очистка холста
      // Рисуем игроков
      ball1Ref.current.draw(ctx);
      ball2Ref.current.draw(ctx);

      if (!isStarted) {
        updateBallSpeed(ball1Ref, 2);
        setBall1Speed(2);
        updateBallSpeed(ball2Ref, 2);
        setBall2Speed(2);

        setBall1Frequency(1000);
        setBall2Frequency(1000);
      }
      // Обновляем скорость шаров в каждой итерации анимации
      ball1Ref.current.y += ball1Ref.current.vy; // Обновляем координату y шара
      ball2Ref.current.y += ball2Ref.current.vy; // Обновляем координату y шара

      // Проверка столкновения с границами поля
      if (
        ball1Ref.current.y - ball1Ref.current.radius < 0 ||
        ball1Ref.current.y + ball1Ref.current.radius > ctx.canvas.height
      ) {
        ball1Ref.current.vy = -ball1Ref.current.vy;
      }
      if (
        ball2Ref.current.y - ball2Ref.current.radius < 0 ||
        ball2Ref.current.y + ball2Ref.current.radius > ctx.canvas.height
      ) {
        ball2Ref.current.vy = -ball2Ref.current.vy;
      }

      // Рисуем и анимируем маленькие шарики
      leftSmallBalls.forEach((ball, index) => {
        ball.draw(ctx);
        ball.x += ball.vx;
        if (checkCollision(ball, ball2Ref.current) && isStarted) {
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
        if (checkCollision(ball, ball1Ref.current) && isStarted) {
          // Увеличиваем счет левому шару
          setScore1((prevScore) => prevScore + 1);
          // Удаляем шар из массива
          const newRightSmallBalls = [...rightSmallBalls];
          newRightSmallBalls.splice(index, 1);
          setRightSmallBalls(newRightSmallBalls);
        }
      });
    },
    [leftSmallBalls, rightSmallBalls, isStarted]
  );

  //useEffect для реализации отталкивания от курсора
  useEffect(() => {
    const ball1 = ball1Ref.current; // Выбираем  шар
    const ball2 = ball2Ref.current; // Выбираем  шар
    const interval = setInterval(() => {
      // Проверяем, не находится ли курсор внутри шара

      // Отталкивание, если курсор НЕ внутри шара 1
      if (checkCollisionMouse(ball1, mouseX, mouseY)) {
        ball1.vy = -ball1.vy;
      }

      // Отталкивание, если курсор НЕ внутри шара 2
      if (checkCollisionMouse(ball2, mouseX, mouseY)) {
        ball2.vy = -ball2.vy;
      }
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [ball1Ref.current.y]);

  // Main useEffect with canvas generste and animateBalls function
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    // Start the animation
    const interval = setInterval(() => {
      animateBalls(ctx, mouseX, mouseY);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [animateBalls, ball1Speed, ball2Speed, selectedColor1, selectedColor2]);

  // UseEffect для генерации маленьких шаров
  useEffect(() => {
    let intervalIdLeft;
    let intervalIdRight;

    if (isStarted) {
      // Запускаем интервалы только если isStarted true
      intervalIdLeft = setInterval(() => {
        generateSmallBall(ball1Ref, selectedColor1);
      }, ball1Frequency);
      intervalIdRight = setInterval(() => {
        generateSmallBall(ball2Ref, selectedColor2);
      }, ball2Frequency);
    } else {
      setScore1(0);
      setScore2(0);
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
  ]);

  return (
    <div className={Styles.main}>
      <button onClick={handleStartStop} className={Styles.startBtn}>
        {isStarted ? "Стоп" : "Старт"}
      </button>

      {/* Модальные окна для изменения цвета снаряда */}
      {isMenuOpen1 && (
        <Popap
          ballRef={ball1Ref}
          handleClosePopap={handleClosePopap}
          handleColorChange={handleColorChange}
          ball1Ref={true}
        />
      )}

      {isMenuOpen2 && (
        <Popap
          ballRef={ball2Ref}
          handleClosePopap={handleClosePopap}
          handleColorChange={handleColorChange}
          ball1Ref={false}
        />
      )}
      {/*  Настойки игрока 1 */}
      <div className={Styles.box}>
        <h1 className={Styles.text}>Получено урона: {score1}</h1>
        <label htmlFor="ball1-frequency">Скорость игрока:</label>
        {/*  Ползунок для увеличения скорости игрока 1 */}
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
        {/*  Ползунок для увеличения скорости выстрелов игрока 1 */}
        <label htmlFor="ball1-frequency">Частота выстрелов игрока:</label>
        <input
          type="range"
          id="ball1-frequency"
          min="100"
          max="1000"
          value={1100 - ball1Frequency}
          onChange={(e) => setBall1Frequency(1100 - parseInt(e.target.value))}
        />
      </div>
      <canvas
        ref={ref}
        {...props}
        onMouseMove={handleMouseMove}
        onClick={(event) => {
          onElementClick(event);
        }}
      />
      {/*  Настройки игрока 2 */}
      <div className={Styles.box}>
        <h1 className={Styles.text}>Получено урона: {score2}</h1>
        {/*  Ползунок для увеличения скорости игрока 2 */}
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
        {/*  Ползунок для увеличения скорости выстрелов игрока 2 */}
        <label htmlFor="ball2-frequency">
          Частота выстрелов правого игрока:
        </label>
        <input
          type="range"
          id="ball2-frequency"
          min="100"
          max="1000"
          value={1100 - ball2Frequency}
          onChange={(e) => setBall2Frequency(1100 - parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Canvas;
