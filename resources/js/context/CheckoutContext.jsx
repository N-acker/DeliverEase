import { createContext, useContext, useState} from "react";

const CheckoutContext = createContext(); //first context is created
// createContext allows a shared value like a store to be defined and accessed by other components 

//CheckoutProvider used as a jsx element in app.jsx 
// it's used to provide all component elements with the variables
export function CheckoutProvider({ children }){
    //useState for the variables below will be used here instead of the component
    const [cartInfo, setCartInfo] = useState({
        cart: [],
        totalBeforeTax: null, //before tax
        manifestTotal: null //after tax
    });
    // const [selectedStore, setSelectedStore] = useState("");
    // const [storeLatLng, setStoreLatLng] = useState({lat: "", lng: ""});
    // const [destLatLng, setDestLatLng] = useState({lat: null, lng: null});
    const [quoteResponse, setQuoteResponse] = useState(null);
    const [quote, setQuote] = useState(null);
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        coordinates: {
            lat: null,
            lng: null,
          },
    });
    const [selectedStoreInfo, setSelectedStoreInfo] = useState({
        store_id: null,
        address: "",
        phone: "",
        coordinates: {
            lat: null,
            lng: null,
          },
        });
    
        

    return ( //the context value is being provided
        // provider makes context value available to all child components
        //any component in <CheckoutProvider> can access shared state(cart, selectedStore, etc.) using context
        <CheckoutContext.Provider value={{
            cartInfo, setCartInfo,
            selectedStoreInfo, setSelectedStoreInfo,
            customerInfo, setCustomerInfo,
            quoteResponse, setQuoteResponse, 
            quote, setQuote
        }}>
            {children} {/* is a prop in react representing; props=properties;
            children lets you nest components inside provider and provider 
            shares state will all nested components; value is the prop containing data
            to be shared to all components */}
        </CheckoutContext.Provider>
    );

}

// useCheckout is used in any component that wants to access the variables
export const useCheckout = () => useContext(CheckoutContext);
//above the context value is being consumed using useContext
//useContext is a react hook that lets you read the current value of a context 
//useCheckout is the current value of the context that is being exported and can be read by other components
//allows child component to access shared data without passing props down manually
