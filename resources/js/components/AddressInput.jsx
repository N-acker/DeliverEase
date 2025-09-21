import React, { useRef, useEffect } from "react";

const AddressInput = ({ name, value, onChange, onSelect, ...props }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!window.google || !window.google.maps) return;

        //here we use autocomplete 
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["address"],
            componentRestrictions: { country: "ca" }, // Optional: restrict to Canada
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            //here the address is being set upon the change in the field 
            if(place.formatted_address){
                // mimic event structure so parent handleChange works
                onChange({ target: { name, value: place.formatted_address } });
            }

            //sets the coordinates once the address is selected 
            if (place.geometry){
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                onSelect({lat, lng});//onSelect is a callback passed in as a prop from the parent element
                //once lat, lng are chosen they are passed upward to the parent element via onSelect
                //from there {coords} are the {lat, lng} object from the child 
                //this allows customerinfo to have the lat/lng to pass to the backend
            }

        });
        
    }, []);

    return (
        <input
            type="text"
            ref={inputRef}
            // ref gives React a direct reference to the actual DOM element
            // We need this because the Google Maps Autocomplete constructor expects a DOM node:
            // const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, { ...options });
            name={name} //needed so parent knows what to update 
            value={value} //same thing above needed so parent knows what to update 
            onChange={(e) => onChange(e)}// keeps state in sync while typing
           {...props} //this is what passes the rest of the props from the parent to the child
           //without the above we won't get the styling from className and placeholder value 
        />
    );
};

export default AddressInput;
