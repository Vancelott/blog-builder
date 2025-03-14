"use client";
import { Button } from "@/app/ui/create/components/button";

export function PositionButtons({ handlePositionChange }) {
  return (
    <div className="flex flex-row gap-1 z-30">
      {/* TODO make a generic function that can handle the top/bottom/left/right click accordingly */}
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
