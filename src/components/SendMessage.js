import { h } from 'hyperapp';

import * as actions from '../actions';

export const SendMessage = (props) => h('form', {
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
    value: props.name,
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
    value: props.text,
    required: true,
    oninput: [
      actions.InputTextSet,
      (e) => ({ text: e.target.value }),
    ],
  }),
  h('button', { type: 'submit', style: { fontSize: '1.2rem', padding: '0.5rem' } }, 'Send'),
]);
