import { useState, useEffect, useRef } from 'react';

export function useAnimatedValue(value: number, duration: number = 1000) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(value);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (value !== previousValue.current) {
      setIsAnimating(true);
      
      // Cancelar animación anterior si existe
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const startValue = previousValue.current;
      const endValue = value;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Función de easing (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = startValue + (endValue - startValue) * easeOut;
        setDisplayValue(Math.round(currentValue));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
          previousValue.current = endValue;
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
  }, [value, duration]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return { displayValue, isAnimating };
}
