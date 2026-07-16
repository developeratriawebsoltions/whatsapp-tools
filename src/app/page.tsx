import Dashboard from "./dashboard/page";
import Login from "./login/page";



export default function Home() {
  return (
    <div className="flex h-screen">
      <Login/>
      <Dashboard />
      </div>
  );
}
