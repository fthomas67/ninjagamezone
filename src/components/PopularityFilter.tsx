import { PopularityFilter as PopularityFilterType } from '../types';
import { Sparkles, Flame, Trophy } from 'lucide-react';

interface PopularityFilterProps {
  selected: PopularityFilterType;
  onChange: (filter: PopularityFilterType) => void;
}

const PopularityFilter = ({ selected, onChange }: PopularityFilterProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-3">Sort by</h2>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange('newest')}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1
            ${selected === 'newest' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
          `}
        >
          <Sparkles className="w-4 h-4" />
          <span>New</span>
        </button>
        
        <button
          onClick={() => onChange('mostplayed')}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1
            ${selected === 'mostplayed' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
          `}
        >
          <Trophy className="w-4 h-4" />
          <span>Most Played</span>
        </button>
        
        <button
          onClick={() => onChange('hotgames')}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1
            ${selected === 'hotgames' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
          `}
        >
          <Flame className="w-4 h-4" />
          <span>Hot</span>
        </button>
      </div>
    </div>
  );
};

export default PopularityFilter;