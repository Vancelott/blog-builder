import { IElement } from "@/app/types/index";
import { TextArea } from "@/app/ui/create/components/textArea";
import { UserNavBar } from "@/app/ui/create/components/userNavBar";
import { Header } from "@/app/ui/create/components/header";
import { Image } from "@/app/ui/create/components/image";

export const CreateComponents = [
  { tag: "textarea", component: TextArea },
  { tag: "nav bar", component: UserNavBar },
  { tag: "header", component: Header },
  { tag: "image", component: Image },
];

export const styles: Array = [
  {
    type: "basic",
    tag: "textarea",
    className: "bg-red-400",
  },
];

export const elements: IElement[] = [
  {
    id: null,
    componentId: 0,
    tag: "textarea",
    style: "basic",
    positionClass: "",
    input: "",
    placeholder: "Text Area",
    dnd: "Draggable",
    isDropped: false,
    disabled: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0 },
    size: {
      height: 220,
      width: 200,
      deltaHeight: 0,
      deltaWidth: 0,
      minHeight: 50,
      minWidth: 50,
    },
  },
  {
    id: null,
    componentId: 1,
    tag: "nav bar",
    style: "basic",
    positionClass: "",
    input: "",
    placeholder: "Navigation Bar",
    dnd: "Droppable",
    otherElements: [],
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0, placement: "" },
    // TODO rename to resize?
    size: {
      height: 100 + "vh",
      width: 325,
      deltaHeight: 0,
      deltaWidth: 0,
      minHeight: 0,
      minWidth: 0,
    },
    isMovable: true,
  },
  {
    id: null,
    componentId: 2,
    tag: "header",
    style: "basic",
    positionClass: "inset-x-0 top-0 h-32",
    input: "",
    placeholder: "Header",
    dnd: "Droppable",
    otherElements: [],
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0, placement: "Top" },
    size: {
      height: 128,
      width: 100 + "vw",
      deltaHeight: 0,
      deltaWidth: 0,
      minHeight: "64px",
      minWidth: "100vw",
    },
  },
  {
    id: null,
    componentId: 3,
    tag: "image",
    style: "basic",
    // positionClass: "flex justify-center place-items-center w-full h-full bg-gray-600",
    positionClass: "flex justify-center place-items-center",
    input: "",
    placeholder: "Image",
    dnd: "Draggable",
    otherElements: [],
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0 },
    size: {
      height: 200,
      width: 200,
      deltaHeight: 0,
      deltaWidth: 0,
      minHeight: "150px",
      minWidth: "150px",
    },
  },
];
