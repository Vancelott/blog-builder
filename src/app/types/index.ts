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
