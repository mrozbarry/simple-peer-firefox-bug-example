import { app, h } from 'hyperapp';

import * as actions from './actions';
import * as subscriptions from './subscriptions'

const Message = ({ from, text, dateTime, type }) => h('article', {
  style: {
    display: 'grid',
    gridTemplateColumns: '250px auto 100px',
    width: '100%',
    overflow: 'visible',
    borderBottom: '1px #f0f0f0 solid',
    padding: '1rem',
    ...(type === 'error'
      ? { backgroundColor: 'red', color: 'white' }
      : {}
    ),
  },
}, [
  h('div', {}, from),
  h('pre', {
    style: {
      overflowX: 'hidden',
      whiteSpace: 'pre-line',
      margin: 0,
    },
  }, text),
  h('small', {
    style: {
      textAlign: 'right',
    },
  }, dateTime.split('T').map(p => h('div', {}, p))),
]);

const CopyableInput = (props) => h('div', {
  style: {
    display: 'flex',
  },
}, [
  h('input', {
    type: 'text',
    readonly: true,
    value: props.value,
    id: props.id,
    style: {
      flexGrow: 1,
    },
  }),
  h('button', {
    type: 'button',
    onclick: [
      actions.CopyElementTextToClipboard,
      { querySelector: `#${props.id}` },
    ],
  }, 'Copy'),
]);

app({
  init: actions.initialState,

  view: (state) => {
    return h('div', {
      style: {
        display: 'grid',
        gridTemplateRows: 'auto 100px',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      },
    }, [
      h('section', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'auto 20%',
        },
      }, [
        h('section', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            overflowY: 'auto',
            height: 'calc(100vh - 200px)',
          },
        }, state.messages.map((message) => (
          h(Message, message)
        ))),
        h('section', {
          style: {
            padding: ' 00.5rem',
            borderLeft: '1px #f0f0f0 solid',
          },
        }, [
          h('button', {
            type: 'button',
            onclick: actions.PeerInitiatorAdd,
            style: { width: '100%' },
          }, 'Create new socket'),
          h('hr'),
          h('form', {
            style: {
              display: 'flex',
            },
            onsubmit: [
              actions.PeerConnectorAdd,
              (e) => {
                e.preventDefault();

                const formData = new FormData(e.target);

                return {
                  offerCode: formData.get('offerCode')
                };
              },
            ],
          }, [
            h('input', { type: 'text', name: 'offerCode', placeholder: 'offer code', style: { flexGrow: 1 } }),
            h('button', { type: 'submit' }, 'Connect to offer'),
          ]),
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
          }, [
            h('div', {}, `id: ${peer.id}`),
            h(CopyableInput, {
              value: peer.offer
                ? btoa(peer.offer)
                : peer.connectionOffer,
              id: `${peer.id}-offer`,
            }),
            peer.connectionOffer && h(CopyableInput, {
              value: peer.answer ? btoa(peer.answer) : '',
              id: `${peer.id}-answer`,
            }),
            !peer.connectionOffer && h('form', {
              onsubmit: [
                actions.PeerSignalAnswer,
                (e) => {
                  e.preventDefault();

                  const formData = new FormData(e.target);

                  return {
                    socket: peer.socket,
                    answer: formData.get('answer'),
                  };
                },
              ],
            }, [
              h('input', {
                type: 'text',
                name: 'answer',
              }),
              h('button', {
                type: 'submit',
              }, 'Connect'),
            ]),
            peer.connectionOffer
              ? [
                h('div', {}, 'type: connector'),
                h('div', {}, `has peer offer: ${Boolean(peer.connectionOffer) ? 'yes' : 'no'}`),
              ]
              : [
                h('div', {}, 'type: initiator'),
                h('div', {}, `has offer: ${Boolean(peer.offer) ? 'yes' : 'no'}`),
                h('div', {}, `has answer: ${Boolean(peer.answer) ? 'yes' : 'no'}`),
              ],
            h('div', {}, `connected: ${peer.connected ? 'yes' : 'no'}`),
          ]))),
        ]),
      ]),

      h('form', {
        method: 'get',
        actions: '#',
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        },
        onsubmit: [
          actions.SendMessage,
          (e) => {
            e.preventDefault();
            return {
              dateTime: (new Date()).toISOString(),
            };
          },
        ],
      }, [
        h('input', {
          type: 'name',
          style: {
            fontSize: '1.2rem',
            padding: '0.5rem',
          },
          value: state.input.name,
          required: true,
          oninput: [
            actions.InputNameSet,
            (e) => ({ name: e.target.value }),
          ],
        }),
        h('input', {
          type: 'text',
          style: {
            fontSize: '1.2rem',
            padding: '0.5rem', flexGrow: 1, margin: '0 0.5rem',
          },
          value: state.input.text,
          required: true,
          oninput: [
            actions.InputTextSet,
            (e) => ({ text: e.target.value }),
          ],
        }),
        h('button', { type: 'submit', style: { fontSize: '1.2rem', padding: '0.5rem' } }, 'Send'),
      ]),
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
        OnDestroy: actions.PeerDestroy,
        OnMessagesAdd: actions.MessagesAdd,
      })
    )),
  ],

  node: document.querySelector('#app'),
});
