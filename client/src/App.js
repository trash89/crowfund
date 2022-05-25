import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  CrowfundContainer,
  CrowTokenContainer,
  SharedLayout,
  Error,
} from "./pages";
import { useIsMounted } from "./hooks";

function App() {
  const isMounted = useIsMounted();
  if (!isMounted) return <></>;
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<CrowfundContainer />} />
            <Route path="/crowfund" element={<CrowfundContainer />} />
            <Route path="/crowtoken" element={<CrowTokenContainer />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
