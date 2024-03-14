import { useCallback, useEffect, useState, useRef } from "react";
import "./Snake.css";

const fruits = [
    'apple',
    'banana',
    'blueberry',
    'cherries',
    'coconut',
    'green-grapes',
    'mango',
    'pear',
    'purple-grapes',
    'strawberry',
    'watermelon',
];

const getRandomPosition = () => ({
    x: 5 + Math.floor(Math.random() * 375),
    y: 5 + Math.floor(Math.random() * 375),
  });

const areElementsIntersecting = (snakeHeadRef, foodRef) => {
  const rect1 = snakeHeadRef.current.getBoundingClientRect();
  const rect2 = foodRef.current.getBoundingClientRect();

  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

function Snake() {
  const [snake, setSnake] = useState([
    {
      x: 10,
      y: 15,
      previous: null,
    },
  ]);
  const snakeHeadRef = useRef(null);
  const foodRef = useRef(null);
  const bombRef = useRef(null);
  const snakeRefs = useRef([]);

//   // Function to update the array of refs
//   const updateRefs = (index, ref) => {
//     snakeRefs.current[index] = ref;
//   };

  const [foodPosition, setFoodPosition] = useState(getRandomPosition());
  const [bombPosition, setBombPosition] = useState(getRandomPosition());

  const [direction, setDirection] = useState("");
  const [snakeHeadAngle, setSnakeHeadAngle] = useState("-90deg");
  const [fruit, setFruit] = useState(fruits[Math.floor(Math.random() * fruits.length)]);
  const [animationStopper, setAnimationStopper] = useState("");
  const [gameSpeed, setGameSpeed] = useState(400);

  const move = useCallback(() => {
    // Check if the snake has reached it's body
    // console.log(snakeRefs.current.filter(el => el).some(ref => areElementsIntersecting(snakeHeadRef, ref)));

    // if (snakeRefs.current.filter(el => el).some(ref => areElementsIntersecting(snakeHeadRef, ref))) {
    //     setDirection("");
    //     alert("Game over!");
    // }
    switch (direction) {
      case "down":
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if (i === 0) {
              const previous = { ...node };
              const newX = node.x + 10;
              if (newX > 375) setDirection("");
              return {
                ...node,
                previous,
                x: newX < 375 ? newX : 375,
              };
            } else {
              return {
                ...prevSnake[i - 1].previous,
              };
            }
          })
        );
        break;
      case "up":
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if (i === 0) {
              const previous = { ...node };
              const newX = node.x - 10;
              if (newX < 5) setDirection("");
              return {
                ...node,
                previous,
                x: newX > 5 ? newX : 5,
              };
            } else {
              return {
                ...prevSnake[i - 1].previous,
              };
            }
          })
        );
        break;
      case "left":
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if (i === 0) {
              const previous = { ...node };
              const newY = node.y - 10;
              if (newY < 5) setDirection("");
              return {
                ...node,
                previous,
                y: newY > 5 ? newY : 5,
              };
            } else {
              return {
                ...prevSnake[i - 1].previous,
              };
            }
          })
        );
        break;
      case "right":
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if (i === 0) {
              const previous = { ...node };
              const newY = node.y + 10;
              if (newY > 375) setDirection("");
              return {
                ...node,
                previous,
                y: newY < 375 ? newY : 375,
              };
            } else {
              return {
                ...prevSnake[i - 1].previous,
              };
            }
          })
        );
    }
    // Check if the snake has reached the food element
    if (areElementsIntersecting(snakeHeadRef, foodRef)) {
      // Handle collision with the element
      console.log("Collision with food");
      setFoodPosition(getRandomPosition());
      setFruit(fruits[Math.floor(Math.random() * fruits.length)])
      setBombPosition(getRandomPosition());
      setSnake((prevSnake) => [
        ...prevSnake,
        { ...prevSnake[prevSnake.length - 1].previous, previous: null },
      ]);
    }
    // Check if the snake has reached the bomb element
    if (areElementsIntersecting(snakeHeadRef, bombRef)) {
      setBombPosition(getRandomPosition());
      setDirection("");
      alert("Game over!");
      // Handle bomb collision logic here
    }
  }, [snake, foodPosition, bombPosition, direction]);

  const handleKeyDown = (event) => {
    event.preventDefault();

    // Check if the pressed key is an arrow key
    switch (event.key) {
      case "Escape":
        setDirection("")
        setAnimationStopper('animation-stopper');
        break;
      case "ArrowUp":
        setDirection("up");
        setSnakeHeadAngle("180deg");
        setAnimationStopper('');
        break;
      case "ArrowDown":
        setDirection("down");
        setSnakeHeadAngle("0deg");
        setAnimationStopper('');
        break;
      case "ArrowRight":
        setDirection("right");
        setSnakeHeadAngle("-90deg");
        setAnimationStopper('');
        break;
      case "ArrowLeft":
        setDirection("left");
        setSnakeHeadAngle("90deg");
        setAnimationStopper('');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const interval = setInterval(move, gameSpeed);

    return () => clearInterval(interval);
  }, [direction, gameSpeed]);

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect will run once after the initial render

  return (
    <>
      <div className="btn-container">
        <button onClick={() => setGameSpeed(400)}>Slow</button>
        <button onClick={() => setGameSpeed(250)}>Medium</button>
        <button onClick={() => setGameSpeed(100)}>Fast</button>
      </div>
      <div className={`snake-container ${animationStopper}`}>
        {snake.map(({ x, y }, i) => (
          <div
            ref={(el) => {
                if(i === 0) snakeHeadRef.current = el;
                snakeRefs.current[i] = el;
            }}
            key={"node" + i}
            className={i === 0 ? 'snake-head' : 'snake'}
            style={{ top: x, left: y, transform: i === 0 ? `rotate(${snakeHeadAngle}) scale(2)` : '' }}
          ></div>
        ))}
        <div
          ref={foodRef}
          className="food"
          style={{ backgroundImage: `url(images/${fruit}.svg)`, top: foodPosition.y, left: foodPosition.x }}
        ></div>
        <div
          ref={bombRef}
          className="bomb"
          style={{ backgroundImage: `url(images/bomb.png)`, top: bombPosition.y, left: bombPosition.x }}
        ></div>
      </div>
    </>
  );
}

export default Snake;
