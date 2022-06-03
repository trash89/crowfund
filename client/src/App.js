import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  CrowdfundContainer,
  CrowdTokenContainer,
  SharedLayout,
  Error,
} from "./pages";
import { useIsMounted } from "./hooks";

function App() {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<CrowdfundContainer />} />
          <Route path="/crowdfund" element={<CrowdfundContainer />} />
          <Route path="/crowdtoken" element={<CrowdTokenContainer />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
