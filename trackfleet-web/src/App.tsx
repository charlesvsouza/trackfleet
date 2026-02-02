import { AppRoutes } from "./routes/AppRoutes"; // Ajuste o import conforme sua pasta real

function App() {
  // REMOVIDO: <AuthProvider> (Já está no main.tsx)
  return (
    <AppRoutes />
  );
}

export default App;