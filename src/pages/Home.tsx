import { useNavigate } from "react-router-dom";
import hardCoverPhoto from "../assets/hard-cover-photo-books_2.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const handleCardSelect = () => {
    navigate("/editor");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 tablet:py-12 desktop:py-16">
      <h1 className="text-3xl font-bold mb-6 text-text-primary">
        Choose Your Photobook
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-6">
        <div
          className="bg-surface rounded-lg p-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer"
          onClick={handleCardSelect}
        >
          <img
            src={hardCoverPhoto}
            alt="Card Preview"
            className="w-full h-48 object-cover mb-4 rounded"
          />
          <h2 className="text-xl font-semibold text-text-primary">
            Classic Layout
          </h2>
          <p className="text-text-secondary">
            A timeless design for your memories.
          </p>
        </div>
        {/* Add more cards as needed */}
      </div>
    </div>
  );
};

export default Home;
