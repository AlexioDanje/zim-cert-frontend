import { useQuery } from '@tanstack/react-query';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CalendarIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserGroupIcon
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
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { LoadingSpinner } from '../components/LoadingStates';

export default function Reports() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      // Mock data for demo
      return {
        totalCertificates: 1250,
        issuedCertificates: 1100,
        revokedCertificates: 50,
        expiredCertificates: 100,
        issuedThisMonth: 45,
        issuedLastMonth: 38,
        certificatesByMonth: [
          { month: 'Jan', certificates: 120, verified: 95, revoked: 5, verifiedRate: 79.2 },
          { month: 'Feb', certificates: 150, verified: 120, revoked: 8, verifiedRate: 80.0 },
          { month: 'Mar', certificates: 180, verified: 145, revoked: 12, verifiedRate: 80.6 },
          { month: 'Apr', certificates: 200, verified: 160, revoked: 15, verifiedRate: 80.0 },
          { month: 'May', certificates: 220, verified: 180, revoked: 18, verifiedRate: 81.8 },
          { month: 'Jun', certificates: 250, verified: 200, revoked: 20, verifiedRate: 80.0 },
        ],
        certificatesByProgram: [
          { name: 'Computer Science', value: 450, color: '#3B82F6' },
          { name: 'Engineering', value: 320, color: '#10B981' },
          { name: 'Business', value: 280, color: '#F59E0B' },
          { name: 'Medicine', value: 200, color: '#EF4444' },
        ],
        verificationStats: {
          totalVerifications: 850,
          successfulVerifications: 820,
          failedVerifications: 30,
          verificationRate: 96.5
        },
        institutionStats: {
          totalInstitutions: 25,
          activeInstitutions: 23,
          totalStudents: 5000,
          totalEmployers: 150
        },
        monthlyGrowth: [
          { month: 'Jan', growth: 5.2 },
          { month: 'Feb', growth: 8.1 },
          { month: 'Mar', growth: 12.3 },
          { month: 'Apr', growth: 15.7 },
          { month: 'May', growth: 18.9 },
          { month: 'Jun', growth: 22.4 },
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

  const verificationData = [
    { name: 'Successful', value: statistics?.verificationStats?.successfulVerifications || 0, fill: '#10B981' },
    { name: 'Failed', value: statistics?.verificationStats?.failedVerifications || 0, fill: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Comprehensive insights into your certificate management system
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics?.totalCertificates || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+{growthRate.toFixed(1)}% from last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Certificates</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics?.issuedCertificates || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {((statistics?.issuedCertificates || 0) / (statistics?.totalCertificates || 1) * 100).toFixed(1)}% of total
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verification Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics?.verificationStats?.verificationRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <EyeIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {statistics?.verificationStats?.successfulVerifications || 0} successful verifications
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Institutions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{statistics?.institutionStats?.activeInstitutions || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {statistics?.institutionStats?.totalInstitutions || 0} total registered
              </span>
            </div>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Certificate Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Certificate Trends</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4 mr-1" />
                Last 6 months
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

          {/* Program Distribution */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Verification Success Rate */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Verification Success Rate</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={[
                  { name: 'Success Rate', value: statistics?.verificationStats?.verificationRate || 0, fill: '#10B981' }
                ]}>
                  <RadialBar dataKey="value" cornerRadius={10} fill="#10B981" />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-900 dark:fill-white">
                    {statistics?.verificationStats?.verificationRate || 0}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Monthly Growth</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics?.monthlyGrowth || []}>
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
                    formatter={(value) => [`${value}%`, 'Growth Rate']}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="#8B5CF6"
                    strokeWidth={4}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Verification Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Verification Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {verificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
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

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Verification Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <EyeIcon className="w-6 h-6 text-blue-600 mr-3" />
              Verification Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Successful</span>
                <span className="font-bold text-green-600">{statistics?.verificationStats?.successfulVerifications || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</span>
                <span className="font-bold text-red-600">{statistics?.verificationStats?.failedVerifications || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-bold text-blue-600">{statistics?.verificationStats?.totalVerifications || 0}</span>
              </div>
            </div>
          </div>

          {/* Institution Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mr-3" />
              Institution Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</span>
                <span className="font-bold text-blue-600">{statistics?.institutionStats?.activeInstitutions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</span>
                <span className="font-bold text-gray-600">{statistics?.institutionStats?.totalInstitutions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Students</span>
                <span className="font-bold text-purple-600">{statistics?.institutionStats?.totalStudents || 0}</span>
              </div>
            </div>
          </div>

          {/* Certificate Status */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <DocumentTextIcon className="w-6 h-6 text-blue-600 mr-3" />
              Certificate Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</span>
                <span className="font-bold text-green-600">{statistics?.issuedCertificates || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Revoked</span>
                <span className="font-bold text-red-600">{statistics?.revokedCertificates || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</span>
                <span className="font-bold text-yellow-600">{statistics?.expiredCertificates || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Export Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center group">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">PDF Report</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download comprehensive analytics report</p>
            </button>
            <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center group">
              <ChartBarIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Excel Export</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Export data for further analysis</p>
            </button>
            <button className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center group">
              <CalendarIcon className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Schedule Report</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Set up automated reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
