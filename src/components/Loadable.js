import { h } from 'hyperapp';

export const Loadable = (props, children) => {
  if (!props.loading) return children;

  return h('div', {}, [
    props.text,
    h('progress', { style: { width: '100%' } }),
  ]);
};

