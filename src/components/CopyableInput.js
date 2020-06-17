import { h } from 'hyperapp';

import * as actions from '../actions';

export const CopyableInput = (props) => h('div', {
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
