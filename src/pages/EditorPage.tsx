import PhotobookEditor from "../components/PhotobookEditor";
import PageLayout from "../Layout/PageLayout";

const EditorPage = () => {
  return (
    <PageLayout title="Create Your Photobook">
      <div className="w-full h-screen">
        <PhotobookEditor />
      </div>
    </PageLayout>
  );
};

export default EditorPage;
