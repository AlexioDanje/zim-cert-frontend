import { type ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: ReactNode;
  color?: 'emerald' | 'blue' | 'purple' | 'red' | 'yellow';
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'emerald' 
}: StatsCardProps) {
  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/20',
    yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${colorClasses[color]}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {value}
                </div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    change.type === 'increase' 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
