import { useReducer } from "react";
import { cartReducer, initialState, type Item } from "./reducer";

const PRODUCTS = [
  { id: "1", name: 'Notebook Pro 14"', price: 8500 },
  { id: "2", name: "Mouse Sem Fio", price: 250 },
  { id: "3", name: "Teclado Mecânico", price: 500 },
];

export function ShoppingCartPage() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalItems = state.items.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  const totalPrice = state.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  const handleAddItem = (item: Item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", id });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const handleClearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <div style={{ display: "flex", gap: "32px", padding: "16px" }}>
      {/* Lista de Produtos */}
      <section style={{ flex: 1 }}>
        <h2>Produtos</h2>
        <ul>
          {PRODUCTS.map((product) => (
            <li key={product.id} style={{ marginBottom: "8px" }}>
              <span>
                {product.name} — R$ {product.price}{" "}
              </span>
              <button onClick={() => handleAddItem(product)}>
                Adicionar ao Carrinho
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Carrinho de Compras */}
      <section
        style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: "16px" }}
      >
        <h2>Seu Carrinho ({totalItems} itens)</h2>

        {state.items.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <>
            <ul>
              {state.items.map((item) => (
                <li key={item.id} style={{ marginBottom: "12px" }}>
                  <div>
                    <strong>{item.name}</strong> — R${" "}
                    {item.price * item.quantity}
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, --item.quantity)
                      }
                    >
                      -
                    </button>
                    <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, ++item.quantity)
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{ marginLeft: "12px", color: "red" }}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <hr />
            <h3>Total: R$ {totalPrice.toFixed(2)}</h3>
            <button onClick={() => handleClearCart()}>Esvaziar Carrinho</button>
          </>
        )}
      </section>
    </div>
  );
}
