export interface IElement {
  id: number;
  componentId: number;
  tag: string;
  style: string;
  input: string;
  placeholder: string;
  dnd: "Droppable" | "Draggable";
  parentId: number | null;
  otherElements?: IElement[];
  isDropped: boolean;
  gridId: string;
  position: { x: number; y: number };
}
