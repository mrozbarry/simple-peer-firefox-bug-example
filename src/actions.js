import * as effects from './effects';

export const initialState = {
  offerCode: '',
  id: '',
  peers: [],
  messages: [],
};

export const SetOfferCode = (state, { offerCode }) => ({
  ...state,
  offerCode,
});

export const CopyOfferCode = (state) => [
  state,
  [
    effects.CopyElement({ querySelector: '#offer-code' }),
  ]
];

export const MessagesAdd = (state, { from, text, dateTime, type }) => ({
  ...state,
  messages: state.messages.concat({
    from,
    text,
    dateTime,
    type: type || 'default',
  }),
});
