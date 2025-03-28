import { IElement } from "@/app/types/index";
import { TextArea } from "@/app/ui/create/components/textArea";
import { UserNavBar } from "@/app/ui/create/components/userNavBar";
import { Header } from "@/app/ui/create/components/header";
// import { TextArea, UserNavBar } from "@/app/ui/create/components";

export const CreateComponents = [
  { tag: "textarea", component: TextArea },
  { tag: "nav bar", component: UserNavBar },
  { tag: "header", component: Header },
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
    input: "",
    placeholder: "Text Area",
    dnd: "Draggable",
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0 },
  },
  {
    id: null,
    componentId: 1,
    tag: "nav bar",
    style: "basic",
    input: "",
    placeholder: "Side Navigation Bar",
    dnd: "Droppable",
    otherElements: [],
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0 },
  },
  {
    id: null,
    componentId: 2,
    tag: "header",
    style: "basic",
    input: "",
    placeholder: "Header",
    dnd: "Droppable",
    otherElements: [],
    isDropped: false,
    parentId: null,
    gridId: null,
    position: { x: 0, y: 0 },
  },
];
