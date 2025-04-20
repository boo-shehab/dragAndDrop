// DraggableInput.tsx
import { Rnd } from 'react-rnd';

const DraggableInput = ({ id }: { id: string }) => {
  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 200,
        height: 50,
      }}
      bounds="parent"
      style={{ position: 'absolute' }}
    >
      <input
        className="w-full h-full border border-gray-400 p-2"
        placeholder={`Input ${id}`}
      />
    </Rnd>
  );
};

export default DraggableInput;
