import { ArcElement, Chart as ChartJS, Legend, Tooltip, Title } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Side from '../../../components/sidebar';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const PieChart = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    carts: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://localhost:3000/api/admin/stats');
        const data = await response.json();
        setStats({
          users: data.users || 150,
          products: data.products || 75,
          carts: data.carts || 30,
          orders: data.orders || 45
        });
      } catch (error) {
        // console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const pieData = {
    labels: ['Users', 'Products', 'Carts', 'Orders'],
    datasets: [{
      data: [stats.users, stats.products, stats.carts, stats.orders],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderColor: '#fff',
      borderWidth: 2
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#1f2937',
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Distribution of Admin Statistics',
        font: { size: 18, weight: 'bold' },
        color: '#1f2937',
        padding: { top: 10, bottom: 20 }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  return (
    <div className="flex w-full">
        <Side/>
    
    <div className="bg-gradient-to-br flex-1/4 from-gray-50 to-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full transform hover:scale-105 transition-transform duration-300">
        <Pie data={pieData} options={chartOptions} />
      </div>
    </div></div>
  );
};

export default PieChart;