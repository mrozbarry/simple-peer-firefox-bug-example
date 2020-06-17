const CopyElementFX = (_dispatch, {
  querySelector,
}) => {
  const element = document.querySelector(querySelector);
  element.select();
  document.execCommand('copy');
};
export const CopyElement = props => [CopyElementFX, props];

const PeerSignalAnswerFX = (_dispatch, {
  socket,
  answer,
}) => {
  socket.signal(JSON.parse(atob(answer)));
};
export const PeerSignalAnswer = props => [PeerSignalAnswerFX, props];
