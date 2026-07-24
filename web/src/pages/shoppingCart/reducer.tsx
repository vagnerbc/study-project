export type Item = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

type State = {
  items: Item[];
};

export const initialState: State = {
  items: [],
};

export const cartReducer = (state: State, action: any) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = {
        ...action.payload,
        quantity: 1,
      };

      const hasItem = state?.items.some((item) => item.id === newItem.id);

      if (hasItem) {
        return {
          ...state,
          items: state?.items.map((item) => {
            if (item.id === newItem.id) {
              console.log({ item });
              return {
                ...item,
                quantity: (item.quantity ?? 0) + 1,
              };
            }

            return item;
          }),
        };
      } else {
        return {
          ...state,
          items: [...state.items, newItem],
        };
      }
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              quantity: action.payload.quantity,
            };
          }

          return item;
        }),
      };
    }

    case "CLEAR_CART": {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
