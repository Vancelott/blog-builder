"use client";
import { Button } from "@/components/ui/button";
import {
  PinTopIcon,
  PinBottomIcon,
  PinLeftIcon,
  PinRightIcon,
} from "@radix-ui/react-icons";

export function PositionButtons({ handlePositionChange }) {
  return (
    <div className="flex flex-row gap-1 z-30">
      {/* TODO make a generic function that can handle the top/bottom/left/right click accordingly */}
      <Button
        size="icon"
        variant="ghost"
        input="Top"
        onClick={() => handlePositionChange("Top")}
      >
        <PinTopIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        input="Bottom"
        onClick={() => handlePositionChange("Bottom")}
      >
        <PinBottomIcon />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        input="Left"
        onClick={() => handlePositionChange("Left")}
      >
        <PinLeftIcon />
      </Button>
      <Button size="icon" variant="ghost" onClick={() => handlePositionChange("Right")}>
        <PinRightIcon />
      </Button>
    </div>
  );
}
