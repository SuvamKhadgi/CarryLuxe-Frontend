// import { Search } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Side from '../../../components/sidebar';

// function SearchItems() {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSearching, setIsSearching] = useState(false);

//   // Authentication check
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const response = await fetch('https://localhost:3000/api/creds/me', {
//           method: 'GET',
//           credentials: 'include',
//         });
//         if (!response.ok) throw new Error('Authentication failed');
//         const data = await response.json();
//         if (!data.role || data.role !== 'admin') {
//           toast.error('Access denied: Admins only');
//           navigate('/', { replace: true });
//         }
//       } catch (error) {
//         toast.error('Please log in');
//         navigate('/login', { replace: true });
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, [navigate]);

//   // Search logic
//   useEffect(() => {
//     const fetchSearchResults = async () => {
//       if (!searchQuery.trim()) {
//         setSearchResults([]);
//         setIsSearching(false);
//         return;
//       }

//       setIsSearching(true);
//       try {
//         const response = await fetch(`https://localhost:3000/api/items/search?query=${encodeURIComponent(searchQuery)}`, {
//           method: 'GET',
//           credentials: 'include',
//         });
//         if (!response.ok) throw new Error('Search failed');
//         const data = await response.json();
//         setSearchResults(data.results || []);
//       } catch (error) {
//         console.error('Error fetching search results:', error);
//         toast.error('Error searching items');
//         setSearchResults([]);
//       } finally {
//         setIsSearching(false);
//       }
//     };
//     fetchSearchResults();
//   }, [searchQuery]);

//   if (loading) return <div className="text-center p-8">Loading...</div>;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Side />
//       <div className="flex-1 p-6">
//         <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Search Items</h2>
//         <div className="mb-6 flex justify-center">
//           <div className="relative w-full max-w-md">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search items by name or description..."
//               className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
//           </div>
//         </div>
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           {isSearching ? (
//             <div className="text-center p-8">Searching...</div>
//           ) : results.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-blue-50 text-blue-800">
//                   <tr>
//                     <th className="p-3 font-semibold text-left">Name</th>
//                     <th className="p-3 font-semibold text-left">Image</th>
//                     <th className="p-3 font-semibold text-left">Description</th>
//                     <th className="p-3 font-semibold text-left">Category</th>
//                     <th className="p-3 font-semibold text-left">Qty</th>
//                     <th className="p-3 font-semibold text-left">Price</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {results.map((item) => (
//                     <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
//                       <td className="p-3 truncate max-w-[150px]">{item.item_name}</td>
//                       <td className="p-3">
//                         <img
//                           src={`https://localhost:3000/uploads/${item.image}`}
//                           alt={item.item_name}
//                           className="h-12 w-12 object-cover rounded-md"
//                         />
//                       </td>
//                       <td className="p-3 truncate max-w-[200px]">{item.description}</td>
//                       <td className="p-3">{item.item_type}</td>
//                       <td className="p-3">{item.item_quantity}</td>
//                       <td className="p-3">${item.item_price}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center p-8">No items found</div>
//           )}
//         </div>
//         <ToastContainer />
//       </div>
//     </div>
//   );
// }
// fake -------------------------
// export default SearchItems;