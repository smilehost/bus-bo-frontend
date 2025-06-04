import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "token_bo";

// ✅ Default state
const defaultState = {
  com_id: 0,
  account_id: 1,
  account_role: "",
  token: "",
  Translation: "", // TH or EN
};

type StoreState = typeof defaultState;

// ✅ Actions
type StoreActions = {
  setField: <K extends keyof StoreState>(key: K, value: StoreState[K]) => void;
};

// ✅ Zustand store
export const useZustandStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      ...defaultState,
      setField: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),
    { name: STORAGE_KEY }
  )
);

// ✅ Proxy Wrapper class
class AppStore {
  private readonly store = useZustandStore;
  private readonly fields = Object.keys(defaultState) as (keyof StoreState)[];

  get proxy() {
    return new Proxy(
      {},
      {
        get: (_, prop: string) => {
          if (prop === "clear") {
            return () => {
              const resetState = { ...defaultState };
              this.store.setState(resetState);
              localStorage.removeItem(STORAGE_KEY);
            };
          }

          if (!this.fields.includes(prop as keyof StoreState)) return undefined;

          const key = prop as keyof StoreState;

          return {
            get: () => this.store.getState()[key],
            set: (value: StoreState[typeof key]) =>
              this.store.getState().setField(key, value),
            use: () => this.store((state) => state[key]),
          };
        },
      }
    ) as {
      [K in keyof StoreState]: {
        get: () => StoreState[K];
        set: (value: StoreState[K]) => void;
        use: () => StoreState[K];
      };
    } & {
      clear: () => void;
    };
  }

  // ✅ ดึงทั้ง state ถ้าต้องการ
  use = () => this.store();
}

// ✅ export
export const store = new AppStore().proxy;
