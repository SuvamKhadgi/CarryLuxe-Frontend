import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Corousal from "../../../components/corousal";
import Footer from "../../../components/footer";
import Navbar from "../../../components/navbar";
import { Mencare } from "../product/menbags";
import { Womancare } from "../product/partybag";
import { useCartprod } from "../product/productquery";
import { Device } from "../product/schoolbags";
import { Firstaid } from "../product/travelbags";
import { Babycare } from "../product/womenbag";

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [userId, setUserId] = useState(null);
    const { mutate: addToCart, isLoading: isAddingToCart } = useCartprod();
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };
    useEffect(() => {
        const fetchUser = async () => {
            const token = getCookie('token');
            if (!token) {

                return;
            }
            try {
                const response = await axios.get("https://localhost:3000/api/creds/me", {
                    withCredentials: true,
                });
                setUserId(response.data.id);
            } catch (error) {
                setUserId(null);
            }
        };
        fetchUser();
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://localhost:3000/api/items/search?query=${encodeURIComponent(query)}`,
                { withCredentials: true }
            );
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
            toast.error("Failed to fetch search results");
        }
    };

    const handleIncrease = (itemId) => {
        const item = searchResults.find((item) => item._id === itemId);
        if (item) {
            setQuantities((prev) => {
                const currentQuantity = prev[itemId] || 1;
                if (currentQuantity < item.item_quantity) {
                    return { ...prev, [itemId]: currentQuantity + 1 };
                }
                return prev;
            });
        }
    };

    const handleDecrease = (itemId) => {
        setQuantities((prev) => {
            const currentQuantity = prev[itemId] || 1;
            if (currentQuantity > 1) {
                return { ...prev, [itemId]: currentQuantity - 1 };
            }
            return prev;
        });
    };

    const handleAddToCart = (itemId) => {
        if (!userId) {
            toast.error("Please log in first.");
            return;
        }
        const quantity = quantities[itemId] || 1;
        addToCart(
            { itemId, quantity },
            {
                onSuccess: () => {
                    toast.success("Item added to cart successfully!", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                },
                onError: (error) => {
                    toast.error(error.response?.data?.message || "Failed to add item to cart.", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                    console.error("Error adding to cart:", error.response?.data || error.message);
                },
            }
        );
    };

    return (
        <div className="bg-gray-100">
            <Navbar onSearch={handleSearch} />
            <div className="pt-32">
                {searchQuery && (
                    <div className="max-w-6xl mx-auto mt-6">
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {searchResults.map((item) => (
                                    <Card
                                        key={item._id}
                                        className="w-full bg-gradient-to-b from-blue-400 to bg-cyan-200 max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden"
                                    >
                                        <CardHeader shadow={false} floated={false} className="h-48">
                                            <img
                                                src={`https://localhost:3000/uploads/${item.image}`}
                                                alt={item.item_name}
                                                className="h-full w-full object-fill"
                                            />
                                        </CardHeader>
                                        <CardBody className="p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <Typography color="blue-gray" className="font-medium text-lg">
                                                    {item.item_name}
                                                </Typography>
                                                <Typography color="blue-gray" className="font-medium text-lg">
                                                    ${item.item_price}
                                                </Typography>
                                            </div>
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="font-normal text-sm opacity-75"
                                            >
                                                {item.description.length > 80
                                                    ? `${item.description.substring(0, 80)}...`
                                                    : item.description}
                                            </Typography>
                                            <div className="flex justify-center items-center mt-4">
                                                <Button
                                                    onClick={() => handleDecrease(item._id)}
                                                    className="bg-red-400 px-3 py-1 text-lg font-bold"
                                                >
                                                    -
                                                </Button>
                                                <span className="mx-4 text-lg font-semibold">
                                                    {quantities[item._id] || 1}
                                                </span>
                                                <Button
                                                    onClick={() => handleIncrease(item._id)}
                                                    className="bg-green-300 px-3 py-1 text-lg font-bold"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </CardBody>
                                        <CardFooter className="pt-4 pb-4">
                                            <Button
                                                ripple={false}
                                                fullWidth={true}
                                                className="bg-blue-gray-900 text-white shadow-md hover:scale-105 transition-transform duration-200"
                                                onClick={() => handleAddToCart(item._id)}
                                                disabled={isAddingToCart}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No items found</p>
                        )}
                    </div>
                )}
                {!searchQuery && (
                    <>
                        <Corousal />
                        <Babycare />
                        <Womancare />
                        <div>
                            <Mencare />
                        </div>
                        <div>
                            <Firstaid />
                        </div>
                        <div>
                            <Device />
                        </div>
                    </>
                )}
            </div>
            <Footer />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
        </div>
    );
};

export default Home;