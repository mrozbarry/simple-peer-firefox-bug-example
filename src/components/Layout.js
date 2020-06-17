import { h } from 'hyperapp';

export const Layout = (_props, children) => h('div', {
  style: {
    display: 'grid',
    gridTemplateRows: 'auto 100px',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
}, children);

