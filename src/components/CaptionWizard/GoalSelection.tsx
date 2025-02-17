import { CaptionFormData } from '@/types/caption';

interface GoalSelectionProps {
  formData: CaptionFormData;
  setFormData: (data: CaptionFormData) => void;
}

const GOALS = [
  {
    id: 'grow_audience',
    name: 'Grow Audience',
    icon: '📈',
    color: 'bg-gradient-to-br from-green-400 to-emerald-500',
    description: 'Expand your follower base and reach'
  },
  {
    id: 'drive_sales',
    name: 'Drive Sales',
    icon: '💰',
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    description: 'Convert followers into customers'
  },
  {
    id: 'boost_engagement',
    name: 'Boost Engagement',
    icon: '🔥',
    color: 'bg-gradient-to-br from-orange-400 to-red-500',
    description: 'Increase likes, comments and shares'
  },
  {
    id: 'share_knowledge',
    name: 'Share Knowledge',
    icon: '📚',
    color: 'bg-gradient-to-br from-purple-400 to-violet-500',
    description: 'Educate and provide value'
  },
  {
    id: 'brand_awareness',
    name: 'Brand Awareness',
    icon: '🎯',
    color: 'bg-gradient-to-br from-pink-400 to-rose-500',
    description: 'Increase visibility and recognition'
  },
  {
    id: 'community_building',
    name: 'Build Community',
    icon: '🤝',
    color: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    description: 'Foster relationships with followers'
  }
];

export const GoalSelection = ({ formData, setFormData }: GoalSelectionProps) => {
  const handleGoalSelect = (goalId: string) => {
    setFormData({
      ...formData,
      goal: goalId
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => handleGoalSelect(goal.id)}
            className={`
              relative overflow-hidden rounded-xl transition-all duration-300
              transform hover:scale-102 hover:shadow-lg
              ${goal.color}
              ${formData.goal === goal.id ? 'ring-4 ring-blue-400 scale-102' : ''}
            `}
          >
            <div className="p-6 text-white">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{goal.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-semibold">{goal.name}</span>
                  <span className="text-sm opacity-90">{goal.description}</span>
                </div>
              </div>

              {/* Selection indicator */}
              {formData.goal === goal.id && (
                <div className="absolute top-3 right-3">
                  <div className="bg-white bg-opacity-25 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id={`grid-${goal.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill={`url(#grid-${goal.id})`} />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Select the primary goal for your content
      </div>
    </div>
  );
};