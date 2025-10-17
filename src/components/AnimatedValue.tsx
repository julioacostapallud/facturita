import { useAnimatedValue } from '../hooks/useAnimatedValue';

interface AnimatedValueProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedValue({ 
  value, 
  duration = 1000, 
  className = '', 
  prefix = '', 
  suffix = '',
  decimals = 0 
}: AnimatedValueProps) {
  const { displayValue, isAnimating } = useAnimatedValue(value, duration);

  const formatValue = (val: number) => {
    if (decimals > 0) {
      return val.toFixed(decimals);
    }
    return val.toLocaleString();
  };

  return (
    <span 
      className={`transition-all duration-300 ${
        isAnimating ? 'scale-110 text-primary-600 font-bold' : ''
      } ${className}`}
    >
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
}
