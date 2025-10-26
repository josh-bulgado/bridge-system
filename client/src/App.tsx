import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./features/auth/pages/SignInPage";
import RegisterPage from "./features/auth/pages/RegisterPage";


const LandingPage = lazy(() => import("./features/landing/pages/LandingPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;


