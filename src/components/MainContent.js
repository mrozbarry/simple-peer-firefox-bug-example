import { h } from 'hyperapp';

export const MainContent = (_props, children) => h('section', {
  style: {
    display: 'grid',
    gridTemplateColumns: 'auto 20%',
  },
}, children);
