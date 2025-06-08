import CreativeEditorSDKComponent from "../components/CreativeEditorSDKComponent";
import PageLayout from "../Layout/PageLayout";

const EditorPage = () => {
  return (
    <PageLayout title="Create Your Photobook">
      <div className="w-full h-screen">
        <CreativeEditorSDKComponent />
      </div>
    </PageLayout>
  );
};

export default EditorPage;
