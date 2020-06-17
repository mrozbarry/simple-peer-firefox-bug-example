import { h } from 'hyperapp';

import { Message } from './Message';

export const MessageList = (props) => h('section', {
  style: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    overflowY: 'auto',
    height: 'calc(100vh - 200px)',
  },
}, props.messages.map((message) => (
  h(Message, message)
)));
