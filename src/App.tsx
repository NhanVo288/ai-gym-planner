import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, lazy } from "react"


const Home = lazy(() => import("./pages/Home"))
const Onboarding = lazy(() => import("./pages/Onboarding"))
const Profile = lazy(() => import("./pages/Profile"))
const Auth = lazy(() => import("./pages/Auth"))
const Account = lazy(() => import("./pages/Account"))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth/:pathname" element={<Auth />} />
          <Route path="/account/:pathname" element={<Account />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App