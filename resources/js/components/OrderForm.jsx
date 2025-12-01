import React, {useState, useEffect} from "react";
import { TrashIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom"; //allows us to navigate to the next page
import { useCheckout } from "../context/CheckoutContext"; //allows us to access the CheckoutConext

export default function OrderForm() {
    const [stores, setStores] = useState([]); // stores are pulled from the db 
    const [menuItems, setMenuItems] = useState([]); // menu items are pulled from the db
    const [selectedItem, setSelectedItem] = useState("");
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const {
        cartInfo, setCartInfo,
        selectedStoreInfo, setSelectedStoreInfo,
    } = useCheckout();


    // cart, setCart,
    //     selectedStore, setSelectedStore,
    //     storeLatLng, setStoreLatLng,
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

    // updates total when cart changes 
    useEffect(() => {

        const beforeTax = cartInfo.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); //The reduce() method, found in various programming languages like JavaScript and Python, is a powerful function used to process an iterable (such as an array or list) and condense it into a single, accumulated value.
        const afterTax = Math.round(beforeTax * 1.13);

        setCartInfo(prev => ( {
            ...prev, 
            totalBeforeTax: beforeTax,
            manifestTotal: afterTax 
            }
        ));

    }, [cartInfo.cart]);

    const addItem = () => {
        if(!selectedItem ||quantity <= 0) return;
        const item = menuItems.find((m) => m.id == selectedItem);
        const qty = Number(quantity) //store quantity as a number 
        setCartInfo(prev => ({
            ...prev,
            cart: [...prev.cart, { ...item, quantity: qty }],

        })); //you're basically saying I want all the items in the cart (...cart) and the new object with the item(along with all its properties which is where ... comes from) and quantity in it
        setSelectedItem("");
        setQuantity(1);
    };

    const removeItem = (index) => {
        setCartInfo(prev => ({
            ...prev,
            cart: prev.cart.filter((_, i) => i != index), //This way you’re replacing the cart property inside cartInfo with a new array where the item at that index has been removed.
        
        })); //_ is the current item and i is the index of the current item; we filter items that have index i != index
    };

    const handleStoreSelect = async (e) => {

        const store_id = e.target.value;

        const store = stores.find((s) => s.external_store_id == store_id);


        if(!store) return;

        const response = await fetch( `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(store.address)}&key=${apiKey}`);
        const data = await response.json();
        console.log("Geocode raw response:", data);
        const location = data.results?.[0]?.geometry?.location;

        if(location) {
            setSelectedStoreInfo(
            prev => ( {
            ...prev, 
             address: store.address || "",
             phone: store.phone || "",
             store_id: store.external_store_id || null,
             coordinates: location //basically here it's saying if location exists use the lat and lng from it otherwise use the previous coordinates
              ? {
                lat: location.lat,
                lng: location.lng,
                }
              : prev.coordinates,

            }));
            // console.log("lat/lng:", location);
        }
    };

    return (

        <div className="p-6 max-w-lg mx-auto border w-full mb-4 mt-4">

            <h1 className="text-4xl font-extrabold tracking-tighter italic pr-[2px] bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text drop-shadow-sm">
                    DeliverEase
            </h1>
                
            <h2 className="text-2xl mb-4 flex items-center">
                powered by&nbsp;
                <span className="text-3xl font-bold text-black mr-1 tracking-tighter" style={{ fontFamily: 'sans-serif' }}>Uber</span>
                <span className="text-3xl font-normal text-black tracking-tight" style={{ fontFamily: 'sans-serif' }}>Direct</span>
            </h2>


             {/* Store dropdown */}
            <label className="block mb-2 ">Select Store Location:</label>
            
            <select
                value={selectedStoreInfo.external_store_id} //this value must match the value of the selected option 
                onChange={handleStoreSelect} //here all the information pertaining to each store is set in the context within handleStoreSelect
                className="border p-2 w-full mb-4"
            >

                <option value="">-- Choose a store location --</option>

                {stores.map((store) => (
                    <option key={store.id} value={store.external_store_id}> {/*the store consists id, address, external_store_id and phone */}
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

            {/* border */}
            <div className= "max-w-lg mx-auto border w-full mb-4 mt-4 pb-4 pl-4">

                {/* Chosen Location */}
                <h2 className="text-xl mt-6">Store Location:</h2>
                {selectedStoreInfo.address && ( // the first part means only show block if selectedStoreInfo.address exists
                <div className="mb-2">
                    {selectedStoreInfo.address}
                </div>
                )}

            {/* Cart */}    
                <h2 className="text-xl mt-6">Cart:</h2>
                <ul className="mb-4">
                    {cartInfo.cart.map((c, idx) => ( // c is the current item in the cart and idx is the current index of the item in the cart
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

                <h2 className="text-xl mt-6">Cart Totals:</h2>
                <div className="mb-2">
                    <div>Subtotal: ${((cartInfo.totalBeforeTax || 0) / 100).toFixed(2)}</div>
                    <div>HST: ${(((cartInfo.manifestTotal || 0) - (cartInfo.totalBeforeTax || 0)) / 100).toFixed(2)}</div>
                    <div>Total: ${((cartInfo.manifestTotal || 0) / 100).toFixed(2)}</div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if(!selectedStoreInfo.address || cartInfo.cart.length === 0) return alert("Missing info");
                        //if the selected store or cart isn't empty navigate to info
                        navigate("info");
                        console.log("cartInfo:", cartInfo);
                        console.log("storeInfo:", selectedStoreInfo);
                    }}
                    className="bg-black text-white px-4 py-2 rounded mt-6 hover:bg-gray-800 hover:shadow cursor-pointer"
                >
                    Continue
                </button>
            </div>

        </div>
    )

   
};