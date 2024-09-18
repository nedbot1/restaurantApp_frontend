import { useState } from "react";
import { updatePayment } from "../services/services";
type EndSessionButtonProps = {
  session_id: string;
  isPaid: boolean;
  order_id: string
  onClose: any
  onStatusChange: (id: string) => void;
}


const Button: React.FC<EndSessionButtonProps> = ({
  session_id,
  isPaid,
  onStatusChange,
  order_id,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaid = async () => {
    try {
      const { data } = await updatePayment(order_id); // Update payment
      onStatusChange(order_id); // Update the UI after payment is processed
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  

  return (
    <div>
      <button
        className={"py-2 px-4 rounded font-bold transition duration-200  text-black"}
        onClick={handlePaid}
        disabled={loading}
      >
        {loading ? "Ending Session..." : isPaid ? "Close" : "Paid"}
      </button>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default Button;
