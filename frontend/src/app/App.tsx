import {HashRouter} from "react-router-dom";
import {QueryClient,QueryClientProvider} from "react-query";
import { Router } from "../router/router";
import { AuthContextProvider } from "./context/AuthContextProvider";

const queryClient = new QueryClient({
    defaultOptions:{
        queries:{
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

export const App = () => {

    return(
        <HashRouter>
            <AuthContextProvider>
                <QueryClientProvider client={queryClient}>
                    <Router />
                </QueryClientProvider>
            </AuthContextProvider>
        </HashRouter>
    )
}