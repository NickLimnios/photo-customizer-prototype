import { useCart } from "../Cart/useCart";
import PageLayout from "../Layout/PageLayout";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const CartPage = () => {
  const { state, dispatch } = useCart();

  return (
    <PageLayout title="Cart">
      <Card className="mt-6 tablet:mt-8 desktop:mt-10 max-w-sm tablet:max-w-md desktop:max-w-lg w-full">
        <CardContent className="p-4">
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
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        {state.items.length > 0 && (
          <Button
            className="mt-4 w-full bg-green-600 hover:bg-green-700"
            onClick={() => {
              /*todo: navigate to checkout*/
            }}
          >
            Proceed to Checkout
          </Button>
        )}
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default CartPage;
