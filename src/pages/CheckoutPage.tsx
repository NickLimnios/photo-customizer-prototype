import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getCart, setCart } from "@/lib/cart";
import { saveOrder, type Order } from "@/lib/orders";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = getCart();

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
    [items],
  );
  const shipping = subtotal >= 7500 || subtotal === 0 ? 0 : 799;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [card, setCard] = useState("");

  const canPlace =
    items.length > 0 &&
    email &&
    name &&
    address &&
    city &&
    zip &&
    country &&
    card.length >= 12;

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
        Checkout
      </h1>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="font-semibold">Contact</div>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="font-semibold">Shipping address</div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <Input
                  placeholder="Address"
                  className="md:col-span-2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  placeholder="ZIP / Postal code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="font-semibold">Payment</div>
              <Input
                placeholder="Card number"
                value={card}
                onChange={(e) => setCard(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Payment is simulated in this demo.
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className="lg:col-span-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="font-semibold">Order summary</div>
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate">
                      {i.title} × {i.qty}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {i.size} • {i.paper}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${((i.unitPrice * i.qty) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${(shipping / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tax</span>
                <span>${(tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                disabled={!canPlace}
                onClick={() => {
                  const order: Order = {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    items,
                    subtotal,
                    shipping,
                    tax,
                    total,
                    email,
                    name,
                    address,
                    city,
                    zip,
                    country,
                    status: "processing",
                    createdAt: new Date().toISOString(),
                  };
                  saveOrder(order);
                  setCart([]);
                  navigate(`/order-complete?orderId=${order.id}`);
                }}
              >
                Place order
              </Button>
              <div className="text-xs text-muted-foreground">
                By placing your order you agree to our terms.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
