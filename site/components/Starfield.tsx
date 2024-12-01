import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [position, setPosition] = useState({ left: '50vw', top: '50vh' });

  useEffect(() => {
    const randomLeft = `${Math.random() * 100}vw`;
    const randomTop = `${Math.random() * 100}vh`;

    setPosition({ left: randomLeft, top: randomTop });
  }, []);

  return (
    <div style={{ position: 'absolute', left: position.left, top: position.top }}>
      <h1>Hello World!</h1>
    </div>
  );
}
