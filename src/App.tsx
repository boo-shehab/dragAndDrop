import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import { Routes, Route } from "react-router-dom";
import PreviewPage from "./PreviewPage"; // import the PreviewPage

export default function App() {
  const [availableFields, setAvailableFields] = useState([
    { id: "firstName", label: "First Name" },
    { id: "secondName", label: "Second Name" },
  ]);

  return (
      <Routes>
        <Route path="/" element={
          <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen overflow-hidden">
              <Sidebar fields={availableFields} />
              <Canvas
                availableFields={availableFields}
                setAvailableFields={setAvailableFields}
              />
            </div>
          </DndProvider>
        } />
        <Route path="/preview" element={<PreviewPage />} />
      </Routes>
  );
}
