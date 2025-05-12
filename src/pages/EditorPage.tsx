import CreativeEditorSDKComponent from "../components/PhotobookEditor/CreativeEditorSDKComponent";

const EditorPage = () => {
  return (
    <div className="w-full h-screen">
      <h1 className="text-3xl font-bold mb-6">Create Your Photobook</h1>
      <CreativeEditorSDKComponent />
    </div>
  );
};

export default EditorPage;
