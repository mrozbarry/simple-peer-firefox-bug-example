import { h } from 'hyperapp';

import * as actions from '../actions';

import { CopyableInput } from './CopyableInput';
import { Loadable } from './Loadable';

export const PeerConnection = (props) => [
  !props.connected && !props.connectionOffer && [
    h(Loadable, {
      loading: !props.offer,
      text: 'Waiting for signalling offer',
    }, [
      h('label', {
        for: `${props.id}-offer`,
      }, 'Offer code:'),
      h(CopyableInput, {
        value: btoa(props.offer),
        id: `${props.id}-offer`,
      }),
      h('small', {}, 'Copy the offer code and paste it into another client'),
    ]),
    h('hr'),
    h('form', {
      style: {
        display: 'flex',
        flexDirection: 'column',
      },
      onsubmit: [
        actions.PeerSignalAnswer,
        (e) => {
          e.preventDefault();

          const formData = new FormData(e.target);

          return {
            socket: props.socket,
            answer: formData.get('answer'),
          };
        },
      ],
    }, [
      h('label', {
        for: `${props.id}-answer`,
      }, 'Answer code generated from other'),
      h('input', {
        type: 'text',
        name: 'answer',
        id: `${props.id}-answer`,
      }),
      h('button', {
        type: 'submit',
      }, 'Connect'),
    ]),
  ],

  !props.connected && props.connectionOffer && [
    h(Loadable, {
      loading: !props.answer,
      text: 'Waiting for signalling answer',
    }, [
      h('label', {
        for: `${props.id}-answer`,
      }, 'Answer code:'),
      h(CopyableInput, {
        value: btoa(props.answer),
        id: `${props.id}-answer`,
      }),
      h('small', {}, 'Copy the answer code and paste it into the initiating client'),
    ]),

  ],
  h('div', {}, `connected: ${props.connected ? 'yes' : 'no'}`),

  props.connected && [
    h('button', {
      onclick: [
        actions.PeerDestroy,
        {
          socket: props.socket,
        },
      ],
    }, 'Close Connection'),
  ],
]
