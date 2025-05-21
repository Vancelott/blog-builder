import { ResizeCallback } from "re-resizable";
import { DragEndEvent } from "@dnd-kit/core";

export type Resize = {
  height: number | string;
  width: number | string;
  deltaHeight: number;
  deltaWidth: number;
  minHeight: number | string;
  minWidth: number | string;
};

export type TempSizeDelta = {
  width: number;
  height: number;
  id: number | null;
};

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
  position: { x: number; y: number; placement?: string };
  size?: Resize;
  isMovable?: boolean;
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
  shouldAdjustPosition: boolean;
  handlePositionChange: (position: string) => void;
}

export interface SlugPageData {
  data: IElement[];
  otherData: { [key: string]: object | string | number } | null;
}

export interface IOtherData {
  parentMargin: { [key: string]: number } | null;
}

export interface IBlogPost {
  id: number;
  page_id: number;
  slug: string;
  title: string;
  html: string;
  username: string;
  created_at: Date;
  edited_at: Date;
  editor_data: string;
}

export interface ICalculateDelta {
  resizingComp: IElement;
  collidingComp: IElement;
  resizingCompDelta: number;
  pos: string;
}

export interface ISwapPositions {
  addedContent: IElement[];
  setAddedContent: React.Dispatch<React.SetStateAction<IElement[]>>;
  draggedComponent: IElement;
  newStatus: string | number;
}

export interface IUpdateCompSize {
  resizingComp: IElement;
  isResizingCompColliding: IElement[] | null;
  compId: number;
  d: ResizeCallback.delta;
  calculateDelta: (
    resizingComp: IElement,
    item: IElement,
    delta: number,
    pos: string
  ) => void;
  setAddedContent: React.Dispatch<React.SetStateAction<IElement[]>>;
}

export interface IUpdateParentMargin {
  setParentMargin: React.Dispatch<React.SetStateAction<{ [name: string]: number }>>;
  componentRefs: React.RefObject<Map<string, HTMLDivElement>>;
}

export interface IUpdatePosition {
  setAddedContent: React.Dispatch<React.SetStateAction<IElement[]>>;
  elementId: string;
  newStatus: string | number;
  delta: DragEndEvent;
}

export interface IValidatePosition {
  delta: DragEndEvent;
  draggedComponent: IElement;
  screenSize: { [name: string]: number };
  parentMargin: { [name: string]: number };
  isParentComponent: IElement;
}
