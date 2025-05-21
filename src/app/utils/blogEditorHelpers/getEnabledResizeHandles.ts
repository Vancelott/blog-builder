export const getEnabledResizeHandles = (componentPosition: string) => {
  const handles = {
    Right: { left: true },
    Left: { right: true },
    Bottom: { top: true },
    Top: { bottom: true },
  };

  return handles[componentPosition];
};
