import type { UserInfo } from "~/utils/session.server";
import type { ReactNode } from "react";

import { createContext } from "react";

type UserContextType = UserInfo | null;

export const UserContext = createContext<UserContextType>(null);

export function UserProvider({ user, children }: { user: UserContextType, children: ReactNode }) {
  return (
    <UserContext.Provider value={ user }>
      { children }
    </UserContext.Provider>
  );
}