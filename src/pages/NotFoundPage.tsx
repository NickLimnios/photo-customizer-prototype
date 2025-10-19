import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import PageLayout from "../Layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => (
  <PageLayout title="Page not found">
    <Card className="border-dashed border-muted/60">
      <CardHeader>
        <CardTitle>We couldn't find that page</CardTitle>
        <CardDescription>
          The link you followed may be broken or the page may have been removed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back home
          </Link>
        </Button>
      </CardContent>
    </Card>
  </PageLayout>
);

export default NotFoundPage;
