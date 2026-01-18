interface MultipleChoiceOption {
  id: string;
  label: string;
}

interface MultipleChoiceProps {
  options: MultipleChoiceOption[];
  selectedId: string | null;
  correctId: string;
  showFeedback: boolean;
  onSelect: (id: string) => void;
}

export function MultipleChoice({
  options,
  selectedId,
  correctId,
  showFeedback,
  onSelect
}: MultipleChoiceProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const isCorrect = option.id === correctId;
        const showCorrect = showFeedback && isCorrect;
        const showWrong = showFeedback && isSelected && !isCorrect;

        let buttonClasses = 'p-4 rounded-lg text-center font-medium transition-all ';

        if (showCorrect) {
          buttonClasses += 'bg-green-100 border-2 border-green-500 text-green-700';
        } else if (showWrong) {
          buttonClasses += 'bg-red-100 border-2 border-red-500 text-red-700';
        } else if (isSelected) {
          buttonClasses += 'bg-indigo-100 border-2 border-indigo-500 text-indigo-700';
        } else {
          buttonClasses += 'bg-gray-100 border-2 border-transparent hover:bg-gray-200 text-gray-800';
        }

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            disabled={showFeedback}
            className={buttonClasses}
          >
            <span className="text-lg">{option.label}</span>
            {showCorrect && <span className="ml-2">✓</span>}
            {showWrong && <span className="ml-2">✗</span>}
          </button>
        );
      })}
    </div>
  );
}
