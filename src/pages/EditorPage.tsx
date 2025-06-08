import { PhotobookEditorMock } from "../components/PhotobookEditorMock";
import PageLayout from "../Layout/PageLayout";

const EditorPage = () => {
  return (
    <PageLayout title="Create Your Photobook">
      <div className="w-full h-screen">
        <PhotobookEditorMock />
      </div>
    </PageLayout>
  );
};

export default EditorPage;
