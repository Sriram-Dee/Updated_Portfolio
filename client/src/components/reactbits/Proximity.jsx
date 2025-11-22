import { useRef } from 'react';
import VariableProximity from './VariableProximity';

const Proximity = ({ text, className = "" }) => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{position: 'relative'}}
    >
      <VariableProximity
        label={text}
        fromFontVariationSettings="'wght' 400, 'opsz' 9"
        toFontVariationSettings="'wght' 1000, 'opsz' 40"
        containerRef={containerRef}
        radius={100}
        falloff='linear'
      />
    </div>
  );
};

export default Proximity;