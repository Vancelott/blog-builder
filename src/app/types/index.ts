import { ResizeCallback } from "re-resizable";
import { DragEndEvent } from "@dnd-kit/core";
import { PartialBlock } from "@blocknote/core";
import { ResizeCallback } from "re-resizable";

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
  inputBlocks: PartialBlock[];
  placeholder: string;
  dnd: "Droppable" | "Draggable" | null;
  parentId: number | null;
  otherElements?: IElement[];
  isDropped: boolean;
  gridId: string;
  position: {
    x: number;
    y: number;
    xPercent: number;
    yPercent: number;
    placement?: string;
  };
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
  isStaticRender: boolean;
  isDragOverlayRender: boolean;
  handlePositionChange: (position: string) => void;
  handleInputChange: (compId: number, text: string, blocks?: PartialBlock[]) => void;
  childHandlers: {
    handleInputChange: (compId: number, text: string, blocks?: PartialBlock[]) => void;
    handleSelectComponent: () => void;
    handleUpdateCompSize: () => void;
    handlePositionChange: (position: string) => void;
    toggleComponentDraggable: () => void;
    setTempSizeDelta: React.Dispatch<
      React.SetStateAction<{ [name: string]: number | null }>
    >;
  };
}

export type RenderedDynamicElement = Partial<
  Pick<
    IDynamicElement,
    | "id"
    | "input"
    | "isDragOverlayRender"
    | "positionClass"
    | "inputBlocks"
    | "handleInputChange"
    | "isStaticRender"
  >
> & {
  style: { height: number; width: number };
};

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
  screenSize: { [name: string]: number };
}

export interface IValidatePosition {
  delta: DragEndEvent;
  draggedComponent: IElement;
  screenSize: { [name: string]: number };
  parentMargin: { [name: string]: number };
  isParentComponent: IElement;
}

export interface IValidateSize {
  delta: ResizeCallback.delta;
  resizingComponent: IElement;
  isChildComponent: IElement;
  parentMargin: { [name: string]: number };
  parentSize: Resize;
  screenSize: { [name: string]: number };
}
