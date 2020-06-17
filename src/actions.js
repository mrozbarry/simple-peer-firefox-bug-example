import Peer from 'simple-peer';

import * as effects from './effects';

const newPeer = (connectionOffer) => ({
  id: Math.random().toString(36).slice(2),
  socket: new Peer({
    initiator: !Boolean(connectionOffer),
    trickle: false,
  }),
  connectionOffer,
  offer: null,
  answer: null,
  connected: false,
});

export const initialState = {
  peers: [],
  messages: [],
  users: [],
  input: {
    name: `User ${Math.random().toString(36).slice(2, 6)}`,
    text: '',
    offer: '',
  },
};

export const CopyElementTextToClipboard = (state, { querySelector }) => [
  state,
  effects.CopyElement({ querySelector }),
];

export const PeerInitiatorAdd = (state) => ({
  ...state,
  peers: state.peers.concat(newPeer()),
});

export const PeerConnectorAdd = (state, { offerCode }) => ({
  ...state,
  peers: state.peers.concat(newPeer(offerCode)),
});

export const PeerSetOffer = (state, { socket, offer }) => {
  return {
    ...state,
    peers: state.peers.map((peer) => peer.socket !== socket ? peer : ({
      ...peer,
      offer,
    })),
  };
};

export const PeerSetAnswer = (state, { socket, answer }) => ({
  ...state,
  peers: state.peers.map((peer) => peer.socket !== socket ? peer : ({
    ...peer,
    answer,
  })),
});

export const PeerSignalAnswer = (state, { socket, answer }) => [
  PeerSetAnswer(state, { socket, answer }),
  effects.PeerSignalAnswer({
    socket,
    answer,
  }),
];

export const PeerConnected = (state, { socket }) => ({
  ...state,
  peers: state.peers.map((peer) => peer.socket !== socket ? peer : ({
    ...peer,
    connected: true,
  })).concat(newPeer()),
});

export const PeerDestroy = (state, { socket }) => ({
  ...state,
  peers: state.peers.filter(p => p.socket !== socket),
});

export const MessagesAdd = (state, { from, text, dateTime, type }) => ({
  ...state,
  messages: state.messages.concat({
    from,
    text,
    dateTime,
    type: type || 'default',
  }),
});

export const InputOfferSet = (state, { offer }) => ({
  ...state,
  input: {
    ...state.input,
    offer,
  },
});

export const PeersAdd = (state) => ({
  ...state,
  peers: state.peers.concat(newPeer(state.input.offer)),
  input: {
    ...state.input,
    offer: '',
  },
});

export const InputNameSet = (state, { name }) => ({
  ...state,
  input: {
    ...state.input,
    name,
  },
});

export const InputTextSet = (state, { text }) => ({
  ...state,
  input: {
    ...state.input,
    text,
  },
});

export const SendMessage = (state, { dateTime }) => {
  const nextState = MessagesAdd(state, {
    from: state.input.name,
    text: state.input.text,
    dateTime,
  });

  return {
    ...nextState,
    input: {
      ...nextState.input,
      text: '',
    },
  };
};
