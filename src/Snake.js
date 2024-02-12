import { useCallback, useEffect, useState, useRef } from 'react';
import './Snake.css';

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * 10),
  y: Math.floor(Math.random() * 10),
});

const areElementsIntersecting = (elementRef1, elementRef2) => {
    const rect1 = elementRef1.current.getBoundingClientRect();
    const rect2 = elementRef2.current.getBoundingClientRect();
  
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
      x: 5,
      y: 5,
      previous: null
    },
  ]);
  const elementRef1 = useRef(null);
  const elementRef2 = useRef(null);
  const elementRef3 = useRef(null);
  const [foodPosition, setFoodPosition] = useState(getRandomPosition());
  const [bombPosition, setBombPosition] = useState(getRandomPosition());

  const [direction, setDirection] = useState('');
  const [gameSpeed, setGameSpeed] = useState(400);

  const move = useCallback(() => {
    switch (direction) {
      case 'down':
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if(i === 0) {
                const previous = { ...node };
                const newX = node.x + 10;
                if(newX > 275) setDirection('');
                return {
                ...node,
                previous,
                x: newX < 275 ? newX : 275,
                };
            } else {
                return {
                    ...prevSnake[i - 1].previous
                }
            }
          })
        );
        break;
      case 'up':
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if(i === 0) {
                const previous = { ...node };
                const newX = node.x - 10;
                if(newX < 5) setDirection('');
                return {
                ...node,
                previous,
                x: newX > 5 ? newX : 5,
                };
            } else {
                return {
                    ...prevSnake[i - 1].previous
                }
            }
          })
        );
        break;
      case 'left':
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if(i === 0) {
                const previous = { ...node };
                const newY = node.y - 10;
                if(newY < 5) setDirection('');
                return {
                ...node,
                previous,
                y: newY > 5 ? newY : 5,
                };
            } else {
                return {
                    ...prevSnake[i - 1].previous
                }
            }
          })
        );
        break;
      case 'right':
        setSnake((prevSnake) =>
          prevSnake.map((node, i) => {
            if(i === 0) {
                const previous = { ...node };
                const newY = node.y + 10;
                if(newY > 275) setDirection('');
                return {
                ...node,
                previous,
                y: newY < 275 ? newY : 275,
                };
            } else {
                return {
                    ...prevSnake[i - 1].previous
                }
            }
          })
        );
    }
    // Check if the snake has reached the food element
    if (areElementsIntersecting(elementRef1, elementRef2)) {
      // Handle collision with the element
      console.log('Collision with food');
        setFoodPosition(getRandomPosition());
        setBombPosition(getRandomPosition());
        setSnake((prevSnake) => [ ...prevSnake, { ...prevSnake[prevSnake.length - 1].previous, previous: null } ])
    }
    // Check if the snake has reached the bomb element
    if (areElementsIntersecting(elementRef1, elementRef3)) {
        setBombPosition(getRandomPosition());
        setDirection('');
        alert('Game over!');
        // Handle bomb collision logic here
    }
  }, [snake, foodPosition, bombPosition, direction]);

  const handleKeyDown = (event) => {
    event.preventDefault();

    // Check if the pressed key is an arrow key
    switch (event.key) {
      case 'ArrowUp':
        setDirection('up');
        break;
      case 'ArrowDown':
        setDirection('down');
        break;
      case 'ArrowRight':
        setDirection('right');
        break;
      case 'ArrowLeft':
        setDirection('left');
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
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this effect will run once after the initial render

  return (
    <>
    <div>
        <button onClick={() => setGameSpeed(400)}>Slow</button>
        <button onClick={() => setGameSpeed(250)}>Medium</button>
        <button onClick={() => setGameSpeed(100)}>Fast</button>
    </div>
    <div className='snake-container'>
      {snake.map(({ x, y }, i) => (
        <div
          ref={ i === 0 ? elementRef1 : null}
          key={'node' + i}
          className='snake'
          style={{ top: x, left: y }}
        ></div>
      ))}
      <div
        ref={elementRef2}
        className='food'
        style={{ top: foodPosition.x * 30, left: foodPosition.y * 30 }}
      ></div>
      <div
        ref={elementRef3}
        className='bomb'
        style={{ top: bombPosition.x * 30, left: bombPosition.y * 30 }}
      ></div>
    </div>
    </>
  );
}

export default Snake;
