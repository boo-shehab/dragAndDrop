import { useEffect, useState } from "react";

interface InputItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: string;
}

const PreviewPage = () => {
  const [items, setItems] = useState<InputItem[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);

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
      } catch (e) {
        console.error("Failed to parse saved inputs:", e);
      }
    }
  }, []);

  const handleChange = (id: string, value: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Print
      </button>

      <div
        id="canvas-container"
        className="relative w-[794px] h-[1123px] border border-gray-400 bg-white"
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
          <input
            key={item.id}
            className="absolute p-2 border border-gray-600 text-xs bg-transparent"
            style={{
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
            }}
            placeholder={item.label}
            value={item.value}
            onChange={e => handleChange(item.id, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewPage;
