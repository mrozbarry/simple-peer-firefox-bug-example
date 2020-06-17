import { h } from 'hyperapp';

export const Message = ({ from, text, dateTime, type }) => h('article', {
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

