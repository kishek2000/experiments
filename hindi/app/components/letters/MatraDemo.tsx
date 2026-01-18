interface MatraDemoProps {
  consonant: string;
  matra: string;
  result: string;
  className?: string;
}

export function MatraDemo({ consonant, matra, result, className = '' }: MatraDemoProps) {
  return (
    <div className={`flex items-center justify-center gap-3 text-2xl ${className}`}>
      <span className="text-gray-700">{consonant}</span>
      <span className="text-gray-400">+</span>
      <span className="text-indigo-600">{matra}</span>
      <span className="text-gray-400">=</span>
      <span className="text-gray-900 font-medium">{result}</span>
    </div>
  );
}

// Common matra combinations for demonstration
export const commonMatraCombinations = [
  { consonant: 'क', matra: 'ा', result: 'का' },
  { consonant: 'क', matra: 'ि', result: 'कि' },
  { consonant: 'क', matra: 'ी', result: 'की' },
  { consonant: 'क', matra: 'ु', result: 'कु' },
  { consonant: 'क', matra: 'ू', result: 'कू' },
  { consonant: 'क', matra: 'े', result: 'के' },
  { consonant: 'क', matra: 'ै', result: 'कै' },
  { consonant: 'क', matra: 'ो', result: 'को' },
  { consonant: 'क', matra: 'ौ', result: 'कौ' }
];
