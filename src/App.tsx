import { useDispatch } from "react-redux";
import AppRoutes from "./routes/route";
import { sessionUser } from "./utils/helper";
import { useEffect } from "react";
import { login } from "./redux/slices/userSlices";

function App() {
  const dispatch = useDispatch();
  const user = sessionUser();
  console.log(user)
  useEffect(() => {
    dispatch(login(user))
  }, [user])



  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <AppRoutes />

    </div>
  );
}

export default App;
