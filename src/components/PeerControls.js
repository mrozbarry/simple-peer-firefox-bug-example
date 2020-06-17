import { h } from 'hyperapp';

import * as actions from '../actions';

export const PeerControls = (props, children) => h('section', {}, [
  h('h3', {}, 'You <- Peer'),
  h('form', {
    onsubmit: [
      actions.PeerInitiatorAdd,
      (e) => e.preventDefault(),
    ],
  }, [
    h('button', {
      type: 'submit',
      style: { width: '100%' },
    }, 'Create new socket'),
  ]),

  h('h3', {}, 'You -> Peer'),
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
]);
