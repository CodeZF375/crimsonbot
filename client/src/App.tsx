import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Muteffikler from "@/pages/Muteffikler";
import Dusmanlar from "@/pages/Dusmanlar";
import AsKadro from "@/pages/AsKadro";
import KsBilgi from "@/pages/KsBilgi";
import Sunucular from "@/pages/Sunucular";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/muteffikler" component={Muteffikler} />
        <Route path="/dusmanlar" component={Dusmanlar} />
        <Route path="/askadro" component={AsKadro} />
        <Route path="/ksbilgi" component={KsBilgi} />
        <Route path="/sunucular" component={Sunucular} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
