import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { RouterProvider } from "react-router-dom";
import router from "./routes/router";






function App() {
  return <RouterProvider router={router} />;
}

export default App;
