import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Programs } from "./pages/Programs";
import { ProgramDetail } from "./pages/ProgramDetail";
import { Impact } from "./pages/Impact";
import { GetInvolved } from "./pages/GetInvolved";
import { Gallery } from "./pages/Gallery";
import { News } from "./pages/News";
import { Donate } from "./pages/Donate";
import { Overseas } from "./pages/Overseas";
import { Contact } from "./pages/Contact";
import { SimplePage } from "./pages/SimplePage";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="programs" element={<Programs />} />
        <Route path="programs/:slug" element={<ProgramDetail />} />
        <Route path="impact" element={<Impact />} />
        <Route path="get-involved" element={<GetInvolved />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="news" element={<News />} />
        <Route path="donate" element={<Donate />} />
        <Route path="donate/overseas" element={<Overseas />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="privacy"
          element={
            <SimplePage
              title="Privacy Policy"
              crumb="Privacy Policy"
              intro="How Akshaya Vidya Foundation collects, uses and protects your personal data under the DPDP Act, 2023."
            />
          }
        />
        <Route
          path="terms"
          element={
            <SimplePage
              title="Terms & Conditions"
              crumb="Terms"
              intro="The terms governing use of this website and our donation services."
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
