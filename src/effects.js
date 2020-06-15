const CopyElementFX = (_dispatch, {
  querySelector,
}) => {
  const element = document.querySelector(querySelector);
  element.select();
  document.execCommand('copy');
};
export const CopyElement = props => [CopyElementFX, props];
