import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CertificateChartProps {
  data?: Array<{
    month: string;
    certificates: number;
  }>;
}

export default function CertificateChart({ data }: CertificateChartProps) {
  // Mock data for demonstration
  const mockData = [
    { month: 'Jan', certificates: 12 },
    { month: 'Feb', certificates: 19 },
    { month: 'Mar', certificates: 15 },
    { month: 'Apr', certificates: 22 },
    { month: 'May', certificates: 18 },
    { month: 'Jun', certificates: 25 },
  ];

  const chartData = data && data.length > 0 ? data : mockData;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="certificates" fill="#14b8a6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
