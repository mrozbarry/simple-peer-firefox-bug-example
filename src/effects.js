const CopyElementFX = (_dispatch, {
  querySelector,
}) => {
  const attemptCopy = () => {
    const element = document.querySelector(querySelector);
    if (!element) {
      return requestAnimationFrame(attemptCopy);
    }
    element.select();
    document.execCommand('copy');
  };
  attemptCopy();
};
export const CopyElement = props => [CopyElementFX, props];

const PeerSignalAnswerFX = (_dispatch, {
  socket,
  answer,
}) => {
  socket.signal(JSON.parse(atob(answer)));
};
export const PeerSignalAnswer = props => [PeerSignalAnswerFX, props];

const PeerSendFX = (_dispatch, {
  socket,
  message,
}) => {
  socket.send(message);
};
export const PeerSend = props => [PeerSendFX, props];
