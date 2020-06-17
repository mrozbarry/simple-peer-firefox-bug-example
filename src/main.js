import { app, h } from 'hyperapp';

import * as actions from './actions';
import * as subscriptions from './subscriptions'

import { Layout } from './components/Layout';
import { MainContent } from './components/MainContent';

import { MessageList } from './components/MessageList';

import { PeerControls } from './components/PeerControls';
import { PeerConnection } from './components/PeerConnection';
import { SendMessage } from './components/SendMessage';

app({
  init: actions.initialState,

  view: (state) => {
    return h(Layout, {}, [
      h(MainContent, {}, [
        h(MessageList, { messages: state.messages }),
        h('section', {
          style: {
            padding: ' 00.5rem',
            borderLeft: '1px #f0f0f0 solid',
          },
        }, [
          h(PeerControls),
          h('hr'),
          h('h2', {}, 'Connections'),
          h('ul', {
            style: {
              listStyle: 'none',
              margin: 0,
              padding: 0,
            },
          }, state.peers.map((peer) => h('li', {
            style: {
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px #e0e0e0 solid',
            },
          }, h(PeerConnection, peer)))),
        ]),
      ]),

      h(SendMessage, state.input),
    ]);
  },

  subscriptions: (state) => [
    ...state.peers.map((peer) => (
      subscriptions.PeerHandler({
        id: peer.id,
        socket: peer.socket,
        connectionOffer: peer.connectionOffer,
        OnOffer: actions.PeerSetOffer,
        OnAnswer: actions.PeerSetAnswer,
        OnPeer: actions.PeerConnected,
        OnDestroy: actions.PeerDestroy,
        OnMessagesAdd: actions.MessagesAdd,
      })
    )),
  ],

  node: document.querySelector('#app'),
});
