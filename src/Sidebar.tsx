import { useDrag } from "react-dnd";

export const ItemTypes = {
  INPUT: "input",
};

interface Field {
  id: string;
  label: string;
}

const DraggableInput = ({ label, id }: Field) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.INPUT,
    item: { label, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className="p-2 border border-gray-400 bg-white rounded cursor-move mb-2"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {label}
    </div>
  );
};

const Sidebar = ({ fields }: { fields: Field[] }) => {
  return (
    <div className="w-64 p-4 bg-gray-100 border-r border-gray-300">
      <h2 className="text-lg font-semibold mb-4">Fields</h2>
      {fields.map((field) => (
        <DraggableInput key={field.id} {...field} />
      ))}
    </div>
  );
};

export default Sidebar;
