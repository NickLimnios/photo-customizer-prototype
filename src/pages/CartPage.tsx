import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";

import type { CartItem } from "@/lib/cart";
import { getCart, setCart } from "@/lib/cart";


function formatPrice(cents: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(getCart());
  }, []);
  useEffect(() => {
    setCart(items);
  }, [items]);
  return {
    items,
    setItems,
    updateQty: (id: string, qty: number) =>
      setItems((arr) =>
        arr.map((i) =>
          i.id === id
            ? { ...i, qty: Math.max(1, Math.min(99, Math.round(qty))) }
            : i,
        ),
      ),
    remove: (id: string) => setItems((arr) => arr.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  };
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl text-center py-24">
      <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
        <ShoppingBag />
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
        Your cart is empty
      </h1>
      <p className="text-muted-foreground mt-2">
        Browse templates and start creating your photobook.
      </p>
      <div className="mt-6">
        <Button asChild size="lg">
          <Link to="/templates">Explore templates</Link>
        </Button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQty, remove } = useCart();

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
    [items],
  );
  const shipping = subtotal >= 7500 || subtotal === 0 ? 0 : 799; // free over $75
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  if (items.length === 0) return <EmptyState />;

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
        Cart
      </h1>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold leading-tight">
                          {item.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="capitalize">
                            {item.style}
                          </Badge>
                          <span>•</span>
                          <span>{item.pages} pages</span>
                          <span>•</span>
                          <span>{item.size}</span>
                          <span>•</span>
                          <span>{item.paper} paper</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatPrice(item.unitPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          per book
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Qty
                        </span>
                        <Select
                          value={String(item.qty)}
                          onValueChange={(v) => updateQty(item.id, parseInt(v))}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold">
                          {formatPrice(item.unitPrice * item.qty)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="font-semibold">Order summary</div>
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full" onClick={() => navigate("/checkout")}>
                Proceed to checkout <ArrowRight className="ml-2" />
              </Button>
              <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground flex items-start gap-2">
                <Package className="mt-0.5 h-4 w-4" />
                <div>
                  Free tracked shipping on orders over $75. Production time: 2–4
                  business days.
                </div>
              </div>
              <PromoCode />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function PromoCode() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Promo code</div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          variant="secondary"
          onClick={() => {
            if (!code.trim()) return;
            setApplied(code.trim());
            setCode("");
          }}
        >
          Apply
        </Button>
      </div>
      {applied && (
        <div className="text-xs text-green-600">
          Code "{applied}" applied. Discounts will be calculated at checkout.
        </div>
      )}
    </div>
  );
}
