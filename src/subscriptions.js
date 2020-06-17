const PeerHandlerSub = (dispatch, {
  id,
  socket,
  connectionOffer,
  OnOffer,
  OnAnswer,
  OnPeer,
  OnDestroy,
  OnMessagesAdd,
}) => {
  const addMessage = (from, text, type) => (
    dispatch(OnMessagesAdd, {
      from,
      text,
      dateTime: (new Date()).toISOString(),
      type,
    })
  );

  console.log('PeerHandlerSub', { id, socket });

  socket.on('error', (error) => {
    console.warn('Peer error', error);
    addMessage('SYS.WEBRTC.ERROR', `Error creating peer: ${error.toString()}. See console for traceback.`, 'error');
  });

  socket.on('signal', (data) => {
    console.log('Peer received signal', data);

    if (data.type === 'offer') {
      addMessage('SYS.WEBRTC.SIGNAL', `Offer:\n${data.sdp}`);
      dispatch(OnOffer, {
        offer: JSON.stringify(data),
        socket,
      });
    } else if (data.type === 'answer') {
      addMessage('SYS.WEBRTC.SIGNAL', `Answer:\n${data.sdp}`);
      dispatch(OnAnswer, {
        answer: JSON.stringify(data),
        socket,
      });
    } else {
      addMessage('SYS.WEBRTC.SIGNAL', JSON.stringify(data, null, 2));
    }
  });

  socket.on('connect', () => {
    console.log('Peer connect');
    addMessage('SYS.WEBRTC', 'New peer connection');
    dispatch(OnPeer, { socket });
  });

  socket.on('data', (data) => {
    const message = JSON.parse('' + data);
    addMessage(message.from, message.text, message.dateTime);
  });

  socket.on('close', () => {
    dispatch(OnDestroy, { socket });
  });

  if (connectionOffer) {
    const offer = JSON.parse(atob(connectionOffer));
    console.log('PeerHandlerSub.connectionOffer', { offer });
    socket.signal(offer)
    requestAnimationFrame(() => (
      addMessage('SYS.WEBRTC', 'Attempting to signal peer')
    ));
  }


  const destroyPeer = () => {
    return socket && socket.destroy && socket.destroy();
  };

  window.addEventListener('beforeunload', destroyPeer);

  return () => {
    console.log('PeerHandlerSub.cancel', { id, socket });
    window.removeEventListener('beforeunload', destroyPeer);
    requestAnimationFrame(destroyPeer);
  };
};
export const PeerHandler = props => [PeerHandlerSub, props];
