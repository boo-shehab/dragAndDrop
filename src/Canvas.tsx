import { useDrop } from "react-dnd";
import { useState } from "react";
import { Rnd } from "react-rnd";
import { ItemTypes } from "./Sidebar";

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
  availableFields,
  setAvailableFields,
}: {
  availableFields: { id: string; label: string }[];
  setAvailableFields: React.Dispatch<
    React.SetStateAction<{ id: string; label: string }[]>
  >;
}) => {
  const [items, setItems] = useState<InputItem[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const [, drop] = useDrop(() => ({
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
  
  const handleDragStop = (e, d, item: InputItem) => {
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
      </div>

      <div
        id="canvas-container"
        ref={drop}
        className="relative w-[794px] h-[1123px] mx-auto border border-gray-400 print:border-none print:scale-[1] print:overflow-hidden bg-white"
        >
        {bgImage && (
            <img
            src={bgImage}
            alt="Contract Background"
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
          onResizeStop={(e, direction, ref, delta, position) => {
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
            className="w-full h-full p-2 border border-gray-600 bg-white"
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
