import { useDispatch } from "react-redux";
import AppRoutes from "./routes/route";
import { sessionUser } from "./utils/helper";
import { useEffect } from "react";
import { login } from "./redux/slices/features/user/userSlices";

function App() {
  const dispatch = useDispatch();
  const user = sessionUser();
  console.log(user)
  useEffect(() => {
    dispatch(login(user))
  }, [user])



  return (
    <div className="min-h-screen flex flex-col ">

      <AppRoutes />

    </div>
  );
}

export default App;
