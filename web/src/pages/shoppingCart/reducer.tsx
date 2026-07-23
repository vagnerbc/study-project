export type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type State = {
  items: Item[];
};

export const initialState: State = {
  items: [],
};

export const cartReducer = (state: State, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const hasItem = state.items.some((item) => item.id === action.payload.id);

      if (hasItem) {
        return {
          ...state,
          items: state.items.map((item) => {
            if (item.id === action.payload.id) {
              return { ...item, quantity: item.quantity++ };
            }

            return { ...item };
          }),
        };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              ...action.payload,
              quantity: 1,
            },
          ],
        };
      }
    }

    case "REMOVE_ITEM": {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case "UPDATE_QUANTITY": {
      return {
        ...state,
        items: state.items
          .map((item) => {
            if (item.id === action.payload.id) {
              return {
                ...item,
                quantity: action.payload.quantity,
              };
            }

            return { ...item };
          })
          .filter((item) => item.quantity > 0),
      };
    }

    case "CLEAR_CART": {
      return initialState;
    }

    default:
      throw Error("Unknown action.");
  }
};
