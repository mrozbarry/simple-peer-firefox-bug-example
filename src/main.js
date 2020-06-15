import { app, h } from 'hyperapp';

import * as actions from './actions';
import * as subscriptions from './subscriptions'

const Message = ({ from, text, dateTime, type }) => h('article', {
  style: {
    display: 'grid',
    gridTemplateColumns: '250px auto 100px',
    width: '100%',
    overflowX: 'hidden',
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
    },
  }, text),
  h('small', {
    style: {
      textAlign: 'right',
    },
  }, dateTime.split('T').map(p => h('div', {}, p))),
]);

app({
  init: actions.initialState,

  view: (state) => h('div', {
    style: {
      display: 'grid',
      gridTemplateRows: '100px auto',
      width: '100vw',
      height: '100vh',
      border: '1px black solid',
    },
  }, [
    h('header', {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px red solid',
        padding: '1rem',
      }
    }, [
      h('form', {
      }, [
        'TODO: Connect to other form...',
      ]),

      h('div', {
        style: {
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }, [
        h('progress', {
          ...(state.offerCode ? { value: 100 } : {}),
        }),
      ]),

      h('div', {}, [
        h('input', {
          id: 'offer-code',
          value: state.offerCode,
          readonly: true,
        }),
        h('button', {
          disabled: !state.offerCode,
          onclick: actions.CopyOfferCode,
        }, 'Copy Connection Code'),
      ]),
    ]),

    h('section', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        overflowY: 'auto',
      },
    }, state.messages.map((message) => (
      h(Message, message)
    ))),
  ]),

  subscriptions: (_state) => [
    subscriptions.PeerHandler({
      OnSetOfferCode: actions.SetOfferCode,
      OnMessagesAdd: actions.MessagesAdd,
    }),
  ],

  node: document.querySelector('#app'),
});
