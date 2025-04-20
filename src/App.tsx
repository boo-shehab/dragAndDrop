import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";

export default function App() {
  const [availableFields, setAvailableFields] = useState([
    { id: "firstName", label: "First Name" },
    { id: "secondName", label: "Second Name" },
  ]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar fields={availableFields} />
        <Canvas
          availableFields={availableFields}
          setAvailableFields={setAvailableFields}
        />
      </div>
    </DndProvider>
  );
}
