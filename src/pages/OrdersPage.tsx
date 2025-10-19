import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOrders, type Order } from "@/lib/orders";
import { Link } from "react-router-dom";

function formatMoney(cents: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = () => setOrders(getOrders());
    load();
    const handler = () => load();
    window.addEventListener("storage", handler);
    window.addEventListener("orders:updated", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("orders:updated", handler as EventListener);
    };
  }, []);

  if (orders.length === 0) {
    return (
      <div className="container max-w-3xl py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Orders
        </h1>
        <p className="text-muted-foreground mt-2">
          You haven't placed any orders yet.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/templates">Create your first photobook</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
        Your orders
      </h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <Card key={o.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Order ID</div>
                  <div className="font-semibold">{o.id}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Placed on {new Date(o.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={o.status === "completed" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {o.status}
                  </Badge>
                  <div className="font-semibold">{formatMoney(o.total)}</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {o.items.map((i, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded border bg-muted">
                      <img
                        src={i.cover}
                        alt="cover"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {i.title} × {i.qty}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {i.size} • {i.paper} • {i.pages} pages
                      </div>
                    </div>
                    <div className="ml-auto text-sm font-medium">
                      {formatMoney(i.unitPrice * i.qty)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/order-complete?orderId=${o.id}`}>
                    View details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
