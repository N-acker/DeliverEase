import { useNavigate } from "react-router-dom"; // drop if not needed

export default function OrderComplete() {
  // add any props/context/hooks you need here
    const navigate = useNavigate();

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order Complete</h1>
      <p className="mb-4">Thanks for your order! We’re preparing it now.</p>
      <button onClick={navigate("/")} className="text-blue-600 underline">
        Back to home
      </button>
    </div>
  );
}
