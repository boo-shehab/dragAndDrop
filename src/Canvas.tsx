import { useDrop } from "react-dnd";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { ItemTypes } from "./Sidebar";
import { useNavigate } from "react-router-dom";

interface InputItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: string;
}

const Canvas = ({
  // availableFields,
  setAvailableFields,
}: {
  availableFields: { id: string; label: string }[];
  setAvailableFields: React.Dispatch<
    React.SetStateAction<{ id: string; label: string }[]>
  >;
}) => {
  const [items, setItems] = useState<InputItem[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [, drop]: any = useDrop(() => ({
    accept: ItemTypes.INPUT,
    drop: (item: { id: string; label: string }, monitor) => {
      const offset = monitor.getClientOffset();
      const container = document
        .getElementById("canvas-container")
        ?.getBoundingClientRect();

      if (!offset || !container) return undefined;

      const x = offset.x - container.left;
      const y = offset.y - container.top;

      // Check if drop is inside canvas
      if (
        x >= 0 &&
        y >= 0 &&
        x <= container.width &&
        y <= container.height
      ) {
        setItems(prev => [
          ...prev,
          {
            id: item.id,
            x,
            y,
            width: 200,
            height: 40,
            label: item.label,
            value: "",
          },
        ]);
        setAvailableFields(prev =>
          prev.filter(field => field.id !== item.id)
        );
        return { success: true };
      } else {
        return { success: false }; // cancel drop
      }
    },
  }));

  const handleChange = (id: string, value: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  const handleRemove = (id: string) => {
    const removed = items.find(i => i.id === id);
    if (removed) {
      // Add it back to the available fields if removed from the canvas
      setAvailableFields(prev => [...prev, { id: removed.id, label: removed.label }]);
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };
  
  const handleDragStop = (_e: any, d: any, item: InputItem) => {
    const container = document.getElementById("canvas-container")?.getBoundingClientRect();
    if (!container) return;
  
    if (
      d.x < 0 ||
      d.y < 0 ||
      d.x + item.width > container.width ||
      d.y + item.height > container.height
    ) {
      // Move item back to field list if it's outside the canvas
      handleRemove(item.id);
    } else {
      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, x: d.x, y: d.y } : i))
      );
    }
  };
  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setBgImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    localStorage.setItem("contractBg", bgImage || "");
    localStorage.setItem("contractInputs", JSON.stringify(items));
  };

  const handleClear = () => {
    // Remove localStorage data
    localStorage.removeItem("contractBg");
    localStorage.removeItem("contractInputs");
  
    // Reset background
    setBgImage(null);
  
    // Return inputs back to the sidebar
    setAvailableFields(prev => {
      const restoredFields = items.map(item => ({ id: item.id, label: item.label }));
      const newFields = restoredFields.filter(
        restored => !prev.find(existing => existing.id === restored.id)
      );
      return [...prev, ...newFields];
    });
  
    // Clear inputs
    setItems([]);
  };

  useEffect(() => {
    const savedBg = localStorage.getItem("contractBg");
    const savedInputs = localStorage.getItem("contractInputs");
  
    if (savedBg) {
      setBgImage(savedBg);
    }
  
    if (savedInputs) {
      try {
        const parsedItems: InputItem[] = JSON.parse(savedInputs);
        setItems(parsedItems);
  
        // Remove used fields from availableFields
        setAvailableFields(prev =>
          prev.filter(field => !parsedItems.some(item => item.id === field.id))
        );
      } catch (e) {
        console.error("Failed to parse saved inputs:", e);
      }
    }
  }, []);
  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mb-4 flex gap-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Print
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Clear
        </button>
        <button
          onClick={() => navigate("/preview")}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Show
        </button>
      </div>

      <div
        id="canvas-container"
        ref={drop}
        className="relative w-[794px] h-[1123px] mx-auto border border-gray-400 print:border-none print:scale-[1] print:overflow-hidden bg-white"
        >
        {bgImage && (
          <img
            src={bgImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover print:block"
            style={{ zIndex: 0 }}
          />
        )}
        {items.map(item => (
          <Rnd
          key={item.id}
          size={{ width: item.width, height: item.height }}
          position={{ x: item.x, y: item.y }}
          onDragStop={(e, d) => handleDragStop(e, d, item)}
          onResizeStop={(_e: any, _direction: any, ref, _delta: any, position) => {
            setItems(prev =>
              prev.map(i =>
                i.id === item.id
                  ? {
                      ...i,
                      width: ref.offsetWidth,
                      height: ref.offsetHeight,
                      x: position.x,
                      y: position.y,
                    }
                  : i
              )
            );
          }}
          bounds="parent"
        >
          <input
            className="w-full h-full p-2 border border-gray-600 bg-transparent text-xs"
            placeholder={item.label}
            value={item.value}
            onChange={e => handleChange(item.id, e.target.value)}
          />
        </Rnd>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
