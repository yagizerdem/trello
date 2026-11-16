import { createContext, useContext } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

type BaseProviderProps = {
  children: React.ReactNode;
};

type BaseProviderState = Record<string, never>;

const initialState: BaseProviderState = {};

const BaseProviderContext = createContext<BaseProviderState>(initialState);

export function BaseProvider({ children, ...props }: BaseProviderProps) {
  const value: BaseProviderState = {};

  return (
    <BaseProviderContext.Provider {...props} value={value}>
      <ThemeProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </BaseProviderContext.Provider>
  );
}

export const useBase = () => {
  const context = useContext(BaseProviderContext);

  if (context === undefined)
    throw new Error("useBase must be used within a BaseProvider");

  return context;
};
