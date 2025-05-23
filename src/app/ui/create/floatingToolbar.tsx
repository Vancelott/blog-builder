import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  GridIcon,
  LayoutIcon,
  ColorWheelIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  PlusIcon,
  MoveIcon,
  CircleIcon,
  TransformIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { PositionButtons } from "@/app/ui/create/components/positionButtons";
import { useState } from "react";
import SubdomainDialog from "@/app/ui/create/subdomainDialog";

// TODO add an interface
export default function FloatingToolbar(props) {
  const [isToggled, setIsToggled] = useState<{ [btnName: string]: boolean }>({});

  const {
    handlePositionChange,
    handlePreviewMode,
    handleGridMode,
    handleSelect,
    shouldCreateOrUpdate,
    editorProps,
    selectedComponent,
    toggleComponentDraggable,
  } = props;
  const { edit } = editorProps ?? {};

  // TODO disable while loading
  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row gap-4 z-50">
        <div className="flex gap-2 px-6 py-3 bg-gray-100 rounded-2xl shadow-lg ">
          <div className="flex gap-1 place-items-center">
            {selectedComponent?.isMovable === true && (
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="ghost">
                        <LayoutIcon
                          style={{
                            display: "inline-block",
                            transform: `scale(2)`,
                          }}
                        />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Move component</TooltipContent>
                </Tooltip>

                <PopoverContent>
                  <PositionButtons handlePositionChange={handlePositionChange} />
                </PopoverContent>
              </Popover>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <div
                    className="w-6 h-6 rounded-full absolute stroke"
                    style={{
                      background:
                        "linear-gradient(150deg,rgba(255, 0, 0, 1) 0%, rgba(237, 221, 83, 1) 25%, rgba(21, 255, 0, 1) 50%, rgba(21, 21, 247, 1) 75%, rgba(226, 84, 214, 1) 100%)",
                    }}
                  />
                  {/* TODO Get rid of the circle icon? */}
                  <CircleIcon
                    style={{
                      display: "inline-block",
                      transform: `scale(2)`,
                    }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Change color</TooltipContent>
            </Tooltip>
            {selectedComponent?.id !== null && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleComponentDraggable()}
                  >
                    <MoveIcon
                      style={{
                        display: "inline-block",
                        transform: `scale(2)`,
                        position: "absolute",
                      }}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle movement</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="flex gap-2 px-4 py-2 bg-gray-100 rounded-2xl shadow-lg">
          <div className="flex gap-2 place-items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  name="grid"
                  onClick={(e) => {
                    const name = e.currentTarget.name;
                    handleGridMode();
                    setIsToggled((prev) => ({ ...prev, [name]: !prev[name] }));
                  }}
                  className="w-8 h-8"
                >
                  <GridIcon
                    className={`${isToggled["grid"] ? "text-cyan-600" : ""}`}
                    style={{
                      display: "inline-block",
                      transform: `scale(2)`,
                    }}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Grid</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  name="preview"
                  onClick={(e) => {
                    const name = e.currentTarget.name;
                    handlePreviewMode();
                    setIsToggled((prev) => ({ ...prev, [name]: !prev[name] }));
                  }}
                  value={true}
                  className="w-8 h-8"
                >
                  {/* TODO Render the icon conditionally */}
                  {isToggled["preview"] ? (
                    <EyeOpenIcon
                      style={{
                        display: "inline-block",
                        transform: `scale(2)`,
                      }}
                    />
                  ) : (
                    <EyeClosedIcon
                      style={{
                        display: "inline-block",
                        transform: `scale(2)`,
                      }}
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-4 place-items-center ">
            <Separator orientation="vertical" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant="solid"
                  onClick={() => handleSelect()}
                  className="bg-cyan-200"
                >
                  <PlusIcon
                    style={{
                      width: 3 + "rem",
                      height: 2 + "rem",
                    }}
                    className="text-cyan-700"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add</TooltipContent>
            </Tooltip>
            {edit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    onClick={() => shouldCreateOrUpdate()}
                    className="hover:bg-cyan-700 h-10"
                  >
                    Update
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Update Your Blog</TooltipContent>
              </Tooltip>
            )}
            {!edit && <SubdomainDialog shouldCreateOrUpdate={shouldCreateOrUpdate} />}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
