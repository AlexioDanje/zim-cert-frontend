import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface DashboardData {
  overview: {
    totalCertificates: number;
    totalInstitutions: number;
    totalStudents: number;
    complianceScore: number;
  };
  trends: {
    certificatesByMonth: Array<{
      month: string;
      count: number;
      growth: number;
    }>;
    verificationActivity: Array<{
      month: string;
      verifications: number;
      successRate: number;
    }>;
  };
  distribution: {
    certificatesByProvince: Array<{
      province: string;
      count: number;
      percentage: number;
    }>;
    certificatesByDegreeLevel: Array<{
      degreeLevel: string;
      count: number;
      percentage: number;
    }>;
    certificatesByFieldOfStudy: Array<{
      field: string;
      count: number;
      percentage: number;
    }>;
  };
  performance: {
    topInstitutions: Array<{
      institutionName: string;
      certificatesIssued: number;
      complianceScore: number;
      studentsEnrolled: number;
    }>;
    complianceDistribution: Array<{
      complianceRange: string;
      count: number;
      percentage: number;
    }>;
  };
  alerts: {
    systemRisks: Array<{
      type: string;
      severity: string;
      description: string;
      affectedInstitutions: string[];
      recommendedActions: string[];
    }>;
    upcomingAudits: Array<{
      institutionName: string;
      nextAuditDate: string;
      auditType: string;
      priority: string;
    }>;
  };
  insights: {
    growingFields: Array<{
      fieldOfStudy: string;
      growthRate: number;
      currentDemand: number;
      projectedDemand: number;
    }>;
    policyRecommendations: Array<{
      category: string;
      priority: string;
      title: string;
      description: string;
      expectedImpact: string;
      estimatedCost: string;
      timeframe: string;
    }>;
  };
}

const reportingApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/reporting/dashboard');
    return response.data;
  },

  exportReport: async (type: string, format: string, filters?: any) => {
    const response = await api.post('/reporting/export', { type, format, filters });
    return response.data;
  },
};

export default function GovernmentDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [exportLoading, setExportLoading] = useState(false);
  
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['government-dashboard'],
    queryFn: reportingApi.getDashboard,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const handleExportReport = async (type: string) => {
    setExportLoading(true);
    try {
      const result = await reportingApi.exportReport(type, 'json');
      
      // Create and download the report
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setExportLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const canViewDashboard = user?.role === 'ministry_admin' || user?.role === 'auditor';

  if (!canViewDashboard) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          Only Ministry administrators and auditors can view the government dashboard.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error Loading Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">
          Failed to load dashboard data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
            National Education Dashboard
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Comprehensive oversight of the national certificate system
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={() => handleExportReport('statistics')}
            disabled={exportLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <AcademicCapIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Certificates</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(dashboardData.overview.totalCertificates)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Institutions</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(dashboardData.overview.totalInstitutions)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(dashboardData.overview.totalStudents)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Compliance Score</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatPercentage(dashboardData.overview.complianceScore)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Issuance Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Certificate Issuance Trend</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData.trends.certificatesByMonth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 w-20">
                    {new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </span>
                  <div className="ml-4 flex-1">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / Math.max(...dashboardData.trends.certificatesByMonth.map(m => m.count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
                  <div className={`flex items-center ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.growth >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4" />
                    )}
                    <span className="text-xs ml-1">{formatPercentage(Math.abs(item.growth))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Verification Activity</h3>
            <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData.trends.verificationActivity.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 w-20">
                  {new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{formatNumber(item.verifications)} verifications</span>
                  <span className={`text-sm font-medium ${item.successRate >= 98 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {formatPercentage(item.successRate)} success
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Province */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">By Province</h3>
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.distribution.certificatesByProvince.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{item.province}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
                  <span className="text-xs text-gray-500">({formatPercentage(item.percentage)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Degree Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">By Degree Level</h3>
            <AcademicCapIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.distribution.certificatesByDegreeLevel.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{item.degreeLevel}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
                  <span className="text-xs text-gray-500">({formatPercentage(item.percentage)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Field of Study */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">By Field of Study</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.distribution.certificatesByFieldOfStudy.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{item.field}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
                  <span className="text-xs text-gray-500">({formatPercentage(item.percentage)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Institutions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Institutions</h3>
          <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificates Issued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students Enrolled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.performance.topInstitutions.map((institution, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{institution.institutionName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(institution.certificatesIssued)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(institution.studentsEnrolled)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      institution.complianceScore >= 90 ? 'bg-green-100 text-green-800' :
                      institution.complianceScore >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {formatPercentage(institution.complianceScore)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Alerts and Upcoming Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Risks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Risks</h3>
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData.alerts.systemRisks.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircleIcon className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-500">No system risks detected</p>
              </div>
            ) : (
              dashboardData.alerts.systemRisks.map((risk, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                      {risk.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{risk.type}</span>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">{risk.description}</p>
                  {risk.affectedInstitutions.length > 0 && (
                    <p className="text-xs text-gray-600 mb-2">
                      Affected: {risk.affectedInstitutions.join(', ')}
                    </p>
                  )}
                  <div className="text-xs text-gray-600">
                    <strong>Actions:</strong> {risk.recommendedActions.join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Audits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Audits</h3>
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {dashboardData.alerts.upcomingAudits.length === 0 ? (
              <div className="text-center py-4">
                <ClockIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No upcoming audits scheduled</p>
              </div>
            ) : (
              dashboardData.alerts.upcomingAudits.map((audit, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{audit.institutionName}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(audit.nextAuditDate).toLocaleDateString()} • {audit.auditType}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    audit.priority === 'high' ? 'bg-red-100 text-red-800' :
                    audit.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {audit.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Policy Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Policy Insights & Recommendations</h3>
          <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growing Fields */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Growing Fields</h4>
            <div className="space-y-3">
              {dashboardData.insights.growingFields.map((field, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-900">{field.fieldOfStudy}</span>
                    <span className="text-sm font-bold text-green-600">+{formatPercentage(field.growthRate)}</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Current: {formatNumber(field.currentDemand)} → Projected: {formatNumber(field.projectedDemand)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Recommendations */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">High Priority Recommendations</h4>
            <div className="space-y-3">
              {dashboardData.insights.policyRecommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-blue-900">{rec.title}</h5>
                    <span className="text-xs text-blue-600 capitalize">{rec.category}</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs text-blue-600">
                    <span>{rec.timeframe}</span>
                    <span>{rec.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
