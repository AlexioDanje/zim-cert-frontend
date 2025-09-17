import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  PlusIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  EyeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { StatsCard } from '../components/StatsCard';
import { LoadingSpinner } from '../components/LoadingStates';

export default function Dashboard() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      // Mock data for demo
      return {
        total: 1250,
        active: 1100,
        revoked: 50,
        expired: 100,
        issuedThisMonth: 45,
        issuedLastMonth: 38,
        certificatesByMonth: [
          { month: 'Jan', certificates: 120, verified: 95, revoked: 5 },
          { month: 'Feb', certificates: 150, verified: 120, revoked: 8 },
          { month: 'Mar', certificates: 180, verified: 145, revoked: 12 },
          { month: 'Apr', certificates: 200, verified: 160, revoked: 15 },
          { month: 'May', certificates: 220, verified: 180, revoked: 18 },
          { month: 'Jun', certificates: 250, verified: 200, revoked: 20 },
        ],
        certificatesByProgram: [
          { name: 'Computer Science', value: 450, color: '#3B82F6' },
          { name: 'Engineering', value: 320, color: '#10B981' },
          { name: 'Business', value: 280, color: '#F59E0B' },
          { name: 'Medicine', value: 200, color: '#EF4444' },
        ],
        recentActivity: [
          { id: '1', type: 'issued', student: 'John Doe', program: 'Computer Science', time: '2 hours ago' },
          { id: '2', type: 'verified', student: 'Jane Smith', program: 'Engineering', time: '4 hours ago' },
          { id: '3', type: 'issued', student: 'Mike Johnson', program: 'Business', time: '6 hours ago' },
          { id: '4', type: 'revoked', student: 'Sarah Wilson', program: 'Medicine', time: '1 day ago' },
        ]
      };
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const growthRate = statistics?.issuedThisMonth && statistics?.issuedLastMonth 
    ? ((statistics.issuedThisMonth - statistics.issuedLastMonth) / statistics.issuedLastMonth) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Here's what's happening with your certificates today
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/verification"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Verify Certificate
              </Link>
              <Link
                to="/issue"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Issue Certificate
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Certificates"
            value={statistics?.total || 0}
            icon={<DocumentTextIcon className="h-8 w-8" />}
            color="blue"
            change={{
              value: statistics?.issuedThisMonth || 0,
              type: 'increase'
            }}
          />
          <StatsCard
            title="Active Certificates"
            value={statistics?.active || 0}
            icon={<CheckCircleIcon className="h-8 w-8" />}
            color="emerald"
            change={{
              value: Math.round(((statistics?.active || 0) / (statistics?.total || 1)) * 100),
              type: 'increase'
            }}
          />
          <StatsCard
            title="Revoked Certificates"
            value={statistics?.revoked || 0}
            icon={<XCircleIcon className="h-8 w-8" />}
            color="red"
            change={{
              value: Math.round(((statistics?.revoked || 0) / (statistics?.total || 1)) * 100),
              type: 'increase'
            }}
          />
          <StatsCard
            title="Expired Certificates"
            value={statistics?.expired || 0}
            icon={<ClockIcon className="h-8 w-8" />}
            color="yellow"
            change={{
              value: Math.round(((statistics?.expired || 0) / (statistics?.total || 1)) * 100),
              type: 'increase'
            }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Certificate Trends Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Certificate Trends</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                +{growthRate.toFixed(1)}% from last month
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statistics?.certificatesByMonth || []}>
                  <defs>
                    <linearGradient id="colorCertificates" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="certificates"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorCertificates)"
                    strokeWidth={3}
                    name="Issued"
                  />
                  <Area
                    type="monotone"
                    dataKey="verified"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorVerified)"
                    strokeWidth={3}
                    name="Verified"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Program Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Program Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statistics?.certificatesByProgram || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statistics?.certificatesByProgram?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontSize: '14px' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Comparison Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Monthly Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics?.certificatesByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="certificates" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Issued"
                  />
                  <Bar 
                    dataKey="verified" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                    name="Verified"
                  />
                  <Bar 
                    dataKey="revoked" 
                    fill="#EF4444" 
                    radius={[4, 4, 0, 0]}
                    name="Revoked"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Verification Rate Line Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Verification Rate Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics?.certificatesByMonth?.map(item => ({
                  ...item,
                  verificationRate: ((item.verified / item.certificates) * 100).toFixed(1)
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-sm text-gray-500"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${value}%`, 'Verification Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="verificationRate"
                    stroke="#8B5CF6"
                    strokeWidth={4}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                    name="Verification Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/issue"
              className="group relative rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <PlusIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Issue Certificate</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create a new certificate</p>
                </div>
              </div>
            </Link>

            <Link
              to="/verification"
              className="group relative rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Verify Certificate</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Check certificate validity</p>
                </div>
              </div>
            </Link>

            <Link
              to="/bulk"
              className="group relative rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Operations</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mass certificate operations</p>
                </div>
              </div>
            </Link>

            <Link
              to="/reports"
              className="group relative rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">View Reports</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Analytics and insights</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            <Link
              to="/certificates"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center"
            >
              View All
              <EyeIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flow-root">
            <ul className="-mb-8">
              {statistics?.recentActivity?.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== statistics.recentActivity.length - 1 ? (
                      <span className="absolute top-6 left-6 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-4">
                      <div>
                        <span className={`h-12 w-12 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                          activity.type === 'issued' ? 'bg-green-500' :
                          activity.type === 'verified' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}>
                          {activity.type === 'issued' ? (
                            <DocumentTextIcon className="h-6 w-6 text-white" />
                          ) : activity.type === 'verified' ? (
                            <ShieldCheckIcon className="h-6 w-6 text-white" />
                          ) : (
                            <XCircleIcon className="h-6 w-6 text-white" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Certificate {activity.type === 'issued' ? 'issued' : activity.type === 'verified' ? 'verified' : 'revoked'} for{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">{activity.student}</span>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Program: {activity.program}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
