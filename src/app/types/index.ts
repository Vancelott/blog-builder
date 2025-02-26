export interface IElement {
  id: number;
  elementId: number;
  tag: string;
  style: string;
  input: string;
  placeholder: string;
  dnd: "Droppable" | "Draggable";
  parentId: number | null;
  otherElements: IElement[];
}
