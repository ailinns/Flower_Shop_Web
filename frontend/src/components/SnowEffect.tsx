import React, { useEffect, useState } from 'react';
import '../styles/snow.css';

interface Snowflake {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

export const SnowEffect: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // สร้างดอกไม้ลอยลงมา 25 ชิ้น
    const flakes: Snowflake[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 20 + Math.random() * 20, // 20-40 วินาที (ตกช้าลง)
      delay: Math.random() * 3, // 0-3 วินาที
      size: 10 + Math.random() * 10, // 20-30px สำหรับอิโมจิ
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            fontSize: `${flake.size}px`,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};
