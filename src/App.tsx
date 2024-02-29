import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import "./global.css";
import { useToast } from "./ui/use-toast";

interface ItemsType {
  id: string;
  content: string;
}

export default function App() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  // TODO: 실제 AIDT 처럼 연동
  const [items, setItems] = useState<ItemsType[] | null>(
    [...Array(4)].map((_, i) => ({ id: `${i}${i}${i}`, content: `item-${i}` }))
  );

  const { toast } = useToast();
  const [completed, setCompleted] = useState<boolean>(false);

  const onDragEnd = ({ source, destination }: DropResult) => {
    try {
      if (!destination) return;
      const _items = JSON.parse(JSON.stringify(items)) as typeof items;
      const [targetItem] = _items?.splice(source.index, 1) ?? [];
      setItems(_items);
      _items?.splice(destination.index, 0, targetItem);

      toast({
        title: "변경중....",
      });

      setInterval(() => {
        localStorage.setItem("items", JSON.stringify(_items));
        setCompleted(false);
        setCompleted(true);
      }, 1500);
    } catch (error) {
      toast({
        title: "변경 실패",
        description: "변경이 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const getItems = () => {
    const data = JSON.parse(localStorage.getItem("items") as string);
    setItems(data);
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    completed &&
      toast({
        title: "변경 완료",
        description: "변경이 완료되었습니다.",
      });
  }, [completed, items]);

  if (!enabled) {
    return null;
  }
  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="divide-y-2 space-y-4 w-20"
            >
              {items?.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div onClick={() => {}}> asd</div>
    </>
  );
}
