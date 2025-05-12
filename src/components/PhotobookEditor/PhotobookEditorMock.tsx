import { v4 as uuidv4 } from "uuid";
import { useCart } from "../../context/useCart";

export function PhotobookEditorMock() {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: uuidv4(),
        name: "Photobook",
        price: 25.0,
      },
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
    >
      Add to Cart
    </button>
  );
}
