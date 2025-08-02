import { Download, RefreshCw, Search } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Side from '../../../components/sidebar';

const ActivityLog = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState(null);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://localhost:3000/api/creds/me', {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Authentication failed');
        const data = await response.json();
        if (!data.role || data.role !== 'admin') {
          toast.error('Access denied: Admins only');
          navigate('/', { replace: true });
        }
      } catch (error) {
        toast.error('Please log in');
        navigate('/login', { replace: true });
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch activity logs
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://localhost:3000/api/admin/activity-logs', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch activity logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      // console.error('Error fetching logs:', error);
      setError(error.message);
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    if (!authLoading) fetchLogs();
  }, [authLoading, fetchLogs]);

  // Debounce search input
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300);

  // Filter and sort logs
  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        const matchesSearch =
          (log.userId?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
          (log.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.details?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
        const matchesAction = filterAction === 'all' || log.action === filterAction;
        return matchesSearch && matchesAction;
      })
      .sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case 'user':
            aValue = a.userId?.first_name || '';
            bValue = b.userId?.first_name || '';
            break;
          case 'action':
            aValue = a.action;
            bValue = b.action;
            break;
          case 'timestamp':
          default:
            aValue = new Date(a.timestamp);
            bValue = new Date(b.timestamp);
            break;
        }
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [logs, searchTerm, filterAction, sortBy, sortOrder]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['User', 'Email', 'Action', 'Details', 'Date'],
      ...filteredLogs.map(log => [
        log.userId?.first_name || 'N/A',
        log.userId?.email || 'N/A',
        log.action,
        log.details ? log.details.replace(/"/g, '""') : 'N/A',
        formatDate(log.timestamp),
      ]),
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Activity logs exported successfully');
  };

  // Get unique actions for filter dropdown
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  if (authLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Side />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Logs</h1>
            <p className="text-gray-600">View and manage system activity logs</p>
          </div>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search logs by user, action, or details..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="timestamp-desc">Latest First</option>
                  <option value="timestamp-asc">Oldest First</option>
                  <option value="user-asc">User A-Z</option>
                  <option value="user-desc">User Z-A</option>
                  <option value="action-asc">Action A-Z</option>
                  <option value="action-desc">Action Z-A</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchLogs}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.userId?.first_name || 'Unknown'} ({log.userId?.email || 'N/A'})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {log.details || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ActivityLog;