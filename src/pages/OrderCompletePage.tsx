import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function OrderCompletePage() {
  const query = useQuery();
  const id = query.get("orderId");
  return (
    <div className="container max-w-2xl py-16 text-center">
      <div className="mx-auto mb-6 h-14 w-14 grid place-items-center rounded-full bg-primary/10 text-primary">
        ✓
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Thank you for your order
      </h1>
      <p className="text-muted-foreground mt-2">
        Your order has been placed and is now being processed.
      </p>
      <Card className="mx-auto mt-8 text-left">
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Order ID</div>
          <div className="font-medium">{id}</div>
          <div className="mt-4 text-sm text-muted-foreground">
            We sent a confirmation email with your order details.
          </div>
        </CardContent>
      </Card>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/orders">Track orders</Link>
        </Button>
      </div>
    </div>
  );
}
