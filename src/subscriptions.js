import Peer from 'simple-peer';

const PeerHandlerSub = (dispatch, {
  connectTo,

  OnSetOfferCode,
  OnMessagesAdd,
}) => {
  console.log('SignalSub.init', { connectTo });

  const addMessage = (from, text, type) => (
    dispatch(OnMessagesAdd, {
      from,
      text,
      dateTime: (new Date()).toISOString(),
      type,
    })
  );

  let peer = new Peer({
    initiator: !connectTo,
    trickle: true,
    reconnectTimer: 30000,
  });

  requestAnimationFrame(() => addMessage('SYSTEM', 'Creating peer...'));

  peer.on('error', (error) => {
    console.warn('Peer error', error);
    addMessage('SYSTEM', `Error creating peer: ${error.toString()}`, 'error');
  });

  peer.on('signal', (data) => {
    console.log('Peer received signal', data);
    addMessage('SYSTEM', 'Generated offer');
    dispatch(OnSetOfferCode, {
      offerCode: btoa(JSON.stringify(data)),
    });
  });

  peer.on('connect', (wut) => {
    console.log('Peer connect', wut);
    addMessage('SYSTEM', 'New peer connection');
  });

  peer.on('data', (data) => {
    console.log('Peer data', data);
    addMessage('SYSTEM', 'New peer data received');
  });

  window.addEventListener('beforeunload', () => {
    peer.destroy();
    peer = null;
  });

  return () => {
    console.log('SignalSub.cancel');

    peer.destroy();
  };
};
export const PeerHandler = props => [PeerHandlerSub, props];
