import PageLayout from "../Layout/PageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const orders = [
  {
    id: "LB-4821",
    status: "In production",
    date: "Feb 12, 2025",
    total: "$68.00",
    pages: 24,
  },
  {
    id: "LB-4774",
    status: "Delivered",
    date: "Jan 26, 2025",
    total: "$54.00",
    pages: 20,
  },
];

const OrdersPage = () => (
  <PageLayout title="Your photobook orders">
    <p className="text-muted-foreground">
      Track the status of every photobook you have created and ordered with
      LumiBook.
    </p>
    <div className="grid gap-6">
      {orders.map((order) => (
        <Card key={order.id} className="border-muted/60">
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Order {order.id}</CardTitle>
              <CardDescription>
                Placed on {order.date} • {order.pages} pages
              </CardDescription>
            </div>
            <Badge variant="secondary">{order.status}</Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Your book is being printed with archival inks and premium paper.
            We will email you once it ships.
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-foreground">Total {order.total}</span>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                View invoice
              </Button>
              <Button size="sm">Reorder</Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  </PageLayout>
);

export default OrdersPage;
