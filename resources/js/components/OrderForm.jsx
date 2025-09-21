import React, {useState, useEffect} from "react";
import { TrashIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom"; //allows us to navigate to the next page
import { useCheckout } from "../context/CheckoutContext"; //allows us to access the CheckoutConext

export default function OrderForm() {
    const [stores, setStores] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const {
        cart, setCart,
        selectedStore, setSelectedStore,
        storeLatLng, setStoreLatLng,
    } = useCheckout();
    // the variables above are used within the context to be shared across all components

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


    //load stores and menu on page
    useEffect(() => {
        fetch("/api/stores")
            .then((res) => res.json())
            .then((data) => setStores(data));

        fetch("/api/menu-items")
            .then((res) => res.json())
            .then((data) => setMenuItems(data))
    }, []);

    const addItem = () => {
        if(!selectedItem ||quantity <= 0) return;
        const item = menuItems.find((m) => m.id == selectedItem);
        setCart([...cart, { ...item, quantity }]); //you're basically saying I want all the items in teh cart (...cart) and the new object with the item adn quanitity in it
        setSelectedItem("");
        setQuantity(1);
    };

    const removeItem = (index) => {
        setCart(cart.filter((_, i) => i != index)); //_ is the current item and i is the index of the current item
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // 0 is the initial value of sum
    };

    const handleStoreSelect = async (e) => {
        const id = e.target.value;
        setSelectedStore(id);

        const store = stores.find((s) => s.id == id);

        if(!store) return;

        const response = await fetch( `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(store.address)}&key=${apiKey}`);
        const data = await response.json();
        console.log("Geocode raw response:", data);
        const location = data.results?.[0]?.geometry?.location;

        if(location) {
            setStoreLatLng(location);
            console.log("lat/lng:", location);
        }
    };

    return (

        <div className="p-6 max-w-lg mx-auto border w-full mb-4 mt-4">

            <h1 className="text-2xl mb-4 flex items-center">
                <span className="text-3xl font-bold text-black mr-1 tracking-tighter" style={{ fontFamily: 'sans-serif' }}>Uber</span>
                <span className="text-3xl font-normal text-black tracking-tight" style={{ fontFamily: 'sans-serif' }}>Direct</span>
                <span className="font-normal text-black ml-2">Order</span>
            </h1>

             {/* Store dropdown */}
            <label className="block mb-2 ">Select Store Location:</label>
            
            <select
                value={selectedStore}
                onChange={handleStoreSelect}
                className="border p-2 w-full mb-4"
            >

                <option value="">-- Choose a store location --</option>

                {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                        {store.address}
                    </option>
                ))}

            </select>



            {/* Item dropdown */}
            <label className="block mb-2">Select Item:</label>
            <select
                value={selectedItem} //controls the text value displaye in the field 
                onChange={(e) => setSelectedItem(e.target.value)}
                className="border p-2 w-full mb-4"
            >
                <option value="">-- Choose an item --</option>
                {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>  {/* value is set to the items id in the array 
                    since its supposed to be selected and thus is given a value; item.name is just what's diplayed in the option
                    but the actual object that is to be selected is simply with value id*/}
                        {item.name} (${(item.price / 100).toFixed(2)})
                    </option>
                ))}
            </select>

            <label className="block mb-2">Quantity:</label>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="border p-2 w-full mb-4"
            />

            <button
                type="button"
                onClick={addItem}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 hover:shadow cursor-pointer"
            >
                Add to Cart
            </button>

            {/* Chosen Location */}
            <div className= "max-w-lg mx-auto border w-full mb-4 mt-4 pb-4 pl-4">
                <h2 className="text-xl mt-6">Store Location:</h2>
                {selectedStore && (
                <div className="mb-2">
                    {stores.find((s) => s.id == selectedStore)?.address || ""}
                </div>
                )}

            {/* Cart */}    
                <h2 className="text-xl mt-6">Cart:</h2>
                <ul className="mb-4">
                    {cart.map((c, idx) => ( // c is the current item in the cart and idx is the current index of the item in the cart
                        <li key={idx} > {/* key is the unique identifier of every item in the map*/}  
                            <span>
                                {c.quantity} × {c.name} (${(c.price / 100).toFixed(2)})
                            </span>
                            <button
                                onClick={() => removeItem(idx)}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                            >
                                <TrashIcon className="h-5 w-5 ml-4"/>
                            </button>
                        </li>
                    ))}
                </ul>

                <h2 className="text-xl mt-6">Subtotal:</h2>
                <div className="mb-2">
                    ${(calculateTotal()/100).toFixed(2)}
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if(!selectedStore || cart.length === 0) return alert("Missing info");
                        //if the selected store or cart isn't empty navigate to info
                        navigate("info");
                        console.log("cart:", cart);
                        console.log("store:", selectedStore);
                        console.log("storetLatLng:", storeLatLng)
                    }}
                    className="bg-black text-white px-4 py-2 rounded mt-6 hover:bg-gray-800 hover:shadow cursor-pointer"
                >
                    Continue
                </button>
            </div>

        </div>
    )

   
};