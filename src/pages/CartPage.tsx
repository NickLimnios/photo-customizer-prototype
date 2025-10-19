import PageLayout from "../Layout/PageLayout";
import { useCart } from "../Cart/useCart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const { state, dispatch } = useCart();
  const total = state.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <PageLayout title="Your cart">
      <Card className="border-muted/60">
        <CardHeader>
          <CardTitle>Photobook order</CardTitle>
          <CardDescription>
            Review your selections before continuing to checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your cart is empty. Head to the editor to design your first book.
            </p>
          ) : (
            <ul className="space-y-4">
              {state.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-dashed border-muted/60 p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {`$${item.price.toFixed(2)}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      dispatch({ type: "REMOVE_ITEM", payload: item.id })
                    }
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Total</span>: $
            {total.toFixed(2)}
          </div>
          <Button size="sm" disabled={state.items.length === 0}>
            Proceed to checkout
          </Button>
        </CardFooter>
      </Card>
    </PageLayout>
  );
};

export default CartPage;
