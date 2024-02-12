import { useCallback, useEffect, useState, useRef } from 'react';
import './Snake.css';
import { debounce } from 'lodash';

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * 10),
  y: Math.floor(Math.random() * 10),
});

const getRandomElement = () => {
  return Math.random() < 0.5 ? 'food' : 'bomb';
};

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
  const [elementType, setElementType] = useState(getRandomElement());
  const [elementPosition, setElementPosition] = useState(
    elementType === 'food' ? getRandomPosition() : getRandomPosition()
  );

  const [direction, setDirection] = useState('');

  const move = useCallback(() => {
    console.log('moving', direction);
    switch (direction) {
      case 'down':
        setSnake((prevSnake) =>
          prevSnake.map((node) => {
            const previous = { ...node };
            const newX = node.x + 10;
            return {
              ...node,
              previous,
              x: newX <= 275 ? newX : 275,
            };
          })
        );
        break;
      case 'up':
        setSnake((prevSnake) =>
          prevSnake.map((node) => {
            const previous = { ...node };
            const newX = node.x - 10;
            return {
              ...node,
              previous,
              x: newX >= 5 ? newX : 5,
            };
          })
        );
        break;
      case 'left':
        setSnake((prevSnake) =>
          prevSnake.map((node) => {
            const previous = { ...node };
            const newY = node.y - 10;
            return {
              ...node,
              previous,
              y: newY >= 5 ? newY : 5,
            };
          })
        );
        break;
      case 'right':
        setSnake((prevSnake) =>
          prevSnake.map((node) => {
            const previous = { ...node };
            const newY = node.y + 10;
            return {
              ...node,
              previous,
              y: newY <= 275 ? newY : 275,
            };
          })
        );
    }
    // Check if the snake has reached the current element (food/bomb)
    if (areElementsIntersecting(elementRef1, elementRef2)) {
      // Handle collision with the element
      console.log('Collision with', elementType);
      if (elementType === 'food') {
        setElementType(getRandomElement());
        setElementPosition(getRandomPosition());
        console.log(snake);
        setSnake((prevSnake) => [ ...prevSnake, { ...prevSnake[prevSnake.length - 1].previous } ])
      } else {
        setElementPosition(getRandomPosition());
        setDirection('');
        alert('Game over!');
        // Handle bomb collision logic here
      }
    }
  }, [snake, elementType, elementPosition, direction]);

  const handleKeyDown = (event) => {
    event.preventDefault();
    // moveInterval && clearInterval(moveInterval);
    console.log('keydown', event.key);
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
    const interval = setInterval(move, 800);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this effect will run once after the initial render

  return (
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
        className={elementType === 'food' ? 'food' : 'bomb'}
        style={{ top: elementPosition.x * 30, left: elementPosition.y * 30 }}
      ></div>
    </div>
  );
}

export default Snake;
