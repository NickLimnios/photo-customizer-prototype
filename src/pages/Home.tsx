import { useNavigate } from "react-router-dom";
import hardCoverPhoto from "../assets/hard-cover-photo-books_2.jpeg";
import PageLayout from "../Layout/PageLayout";
import { Card, CardContent, CardTitle, CardDescription } from "../components/ui/card";

const Home = () => {
  const navigate = useNavigate();

  const handleCardSelect = () => {
    navigate("/editor");
  };

  return (
    <PageLayout title="Choose Your Photobook">
      <div className="grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-6">
        <Card
          className="hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer"
          onClick={handleCardSelect}
        >
          <img
            src={hardCoverPhoto}
            alt="Card Preview"
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <CardContent>
            <CardTitle>Classic Layout</CardTitle>
            <CardDescription>A timeless design for your memories.</CardDescription>
          </CardContent>
        </Card>
        {/* Add more cards as needed */}
      </div>
    </PageLayout>
  );
};

export default Home;
