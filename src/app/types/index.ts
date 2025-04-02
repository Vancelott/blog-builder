export interface IElement {
  id: number | null;
  componentId: number;
  tag: string;
  style: string;
  positionClass: string;
  input: string;
  placeholder: string;
  dnd: "Droppable" | "Draggable" | null;
  parentId: number | null;
  otherElements?: IElement[];
  isDropped: boolean;
  gridId: string;
  position: { x: number; y: number };
}

export interface IDynamicElement {
  element: IElement;
  className: string;
  previewMode: boolean;
  isDropped: boolean;
  childElements: Array;
  input: string;
  positionStyle: string;
  ref: HTMLDivElement;
  handlePositionChange: (position: string) => void;
}
