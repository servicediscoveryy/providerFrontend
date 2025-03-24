import AppRoutes from "./routes/route";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="">{/* <NavBar /> */}</div>
      <div className="">
        <AppRoutes />
      </div>
      <div>{/* <Footer /> */}</div>
    </div>
  );
}

export default App;
