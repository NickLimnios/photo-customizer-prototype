import { useCart } from "../Cart/useCart";
import PageLayout from "../Layout/PageLayout";

const CartPage = () => {
  const { state, dispatch } = useCart();

  return (
    <PageLayout title="Cart">
      <div className="mt-6 tablet:mt-8 desktop:mt-10 max-w-sm tablet:max-w-md desktop:max-w-lg w-full bg-white shadow-lg rounded-lg p-4">
        {state.items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {state.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">{`$${item.price.toFixed(2)}`}</p>
                </div>
                <button
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {state.items.length > 0 && (
          <button
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
            onClick={() => {
              /*todo: navigate to checkout*/
            }}
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </PageLayout>
  );
};

export default CartPage;
