export const FadeTransition = (index: number, position: any) => {
  const sceneRange = [index - 1, index];
  const outputOpacity = [0, 1];
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputOpacity,
  });

  return {
    opacity: transition,
  };
};

export const NavigationConfig = () => {
  return {
    screenInterpolator: (screenProps: any) => {
      const { position, scene, index } = screenProps;
      return FadeTransition(index, position);
    },
  };
};
