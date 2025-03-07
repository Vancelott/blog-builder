"use client";
import { Button } from "@/app/ui/create/components/button";

export function PositionButtons({ handlePositionChange }) {
  return (
    <div className="flex flex-row gap-1 z-30">
      {/* TODO make a generic function that can handle the top/bottom/left/right click accordingly */}
      {/* Note for tomorrow, can't I just pass the onClick via the parent component, and the handler is actually in the parent component, where a simple string state gets set? */}
      <Button
        input="Top"
        addClassName="bg-blue-800 focus:bg-blue-900"
        onClick={handlePositionChange}
      />
      <Button
        input="Bottom"
        addClassName="bg-blue-800 focus:bg-blue-900"
        onClick={handlePositionChange}
      />
      <Button
        input="Left"
        addClassName="bg-blue-800 focus:bg-blue-900"
        onClick={handlePositionChange}
      />
      <Button
        input="Right"
        addClassName="bg-blue-800 focus:bg-blue-900"
        onClick={handlePositionChange}
      />
    </div>
  );
}
