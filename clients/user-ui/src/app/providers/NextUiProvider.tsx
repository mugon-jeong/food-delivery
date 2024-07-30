// app/providers.tsx
"use client";

import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemeProvider} from "next-themes"
import {ApolloProvider} from "@apollo/client";
import {graphqlClient} from "@/src/graphql/gql.setup";

function Providers({children}: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={graphqlClient}>
            <NextUIProvider>
                <NextThemeProvider attribute={"class"} defaultTheme={"dark"}>
                    {children}
                </NextThemeProvider>
            </NextUIProvider>
        </ApolloProvider>
    );
}

export default Providers;