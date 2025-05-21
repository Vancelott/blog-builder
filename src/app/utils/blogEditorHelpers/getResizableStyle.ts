export const getResizableStyle = (componentPosition: string) => {
  const additionalStyling = { position: "fixed", border: "1px dashed #ccc" };

  const styles = {
    // TODO fix - additionalStyling doesn't work this way
    Right: { right: 0, top: 0, bottom: 0, position: "fixed", additionalStyling },
    Left: { left: 0, top: 0, bottom: 0, position: "fixed", additionalStyling },
    Bottom: { left: 0, right: 0, bottom: 0, position: "fixed", additionalStyling },
    Top: { left: 0, right: 0, top: 0, position: "fixed", additionalStyling },
  };

  return styles[componentPosition];
};
