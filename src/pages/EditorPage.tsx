import PhotobookEditorPro from "../components/PhotobookEditorPro";
import PageLayout from "../Layout/PageLayout";

const EditorPage = () => {
  return (
    <PageLayout title="Create Your Photobook (PRO)">
      <div className="w-full h-screen">
        <PhotobookEditorPro />
      </div>
    </PageLayout>
  );
};

export default EditorPage;
