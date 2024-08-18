import Styles from "./Canvas.module.css";
import { useRef, useEffect, useState } from 'react';

const Canvas = (props) => {
  const ref = useRef();

  const [balls, setBalls] = useState([
    createBall(50, 100, 0, 2, 25, "blue"),
    createBall(props.width - 50, 100, 0, 2, 25, "red"),
  ]);

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

  const [smallBalls, setSmallBalls] = useState([]); // Массив для маленьких шаров

  const handleClick = () => {
    // Создаем маленький шар из левого большого шара
    const newSmallBallLeft = createBall(
      balls[0].x + balls[0].radius,
      balls[0].y,
      5, // Скорость вправо
      0,
      10,
      "yellow" // Цвет
    );

    // Создаем маленький шар из правого большого шара
    const newSmallBallRight = createBall(
      balls[1].x - balls[1].radius,
      balls[1].y,
      -5, // Скорость влево
      0,
      10,
      "cyan" // Цвет
    );

    setSmallBalls([...smallBalls, newSmallBallLeft, newSmallBallRight]);
  };



  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Function to animate all balls
    function animateBalls() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Очистка холста

      // Draw each ball
      balls.forEach((ball) => {
        ball.draw(ctx); // Pass the canvas context to the draw function
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Отскок от верхней и нижней границы
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
          ball.vy = -ball.vy;
        }
      });

      // Draw and animate small balls
      smallBalls.forEach((ball, index) => {
        ball.draw(ctx);
        ball.x += ball.vx;

        // Удаляем шары, которые вылетели за пределы холста
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
          const newSmallBalls = [...smallBalls];
          newSmallBalls.splice(index, 1);
          setSmallBalls(newSmallBalls);
        }
      });

      animationId = window.requestAnimationFrame(animateBalls);
    }

    // Start the animation
    animateBalls();

    return () => window.cancelAnimationFrame(animationId);
  }, [handleClick]); // Remove handleClick from dependency array

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'black' }}>
             <button style={{ marginBottom: '20px' }} onClick={handleClick}>
        Добавить шары!
      </button> 
      <canvas ref={ref} {...props} style={{ backgroundImage: `url("https://klike.net/uploads/posts/2022-09/1662044139_j-17.jpg")` }} /> 
    </div>
  );
};

export default Canvas;