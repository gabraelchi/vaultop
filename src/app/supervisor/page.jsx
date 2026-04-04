import SupervisorDashboard from "./supervisor"


useEffect(()=>{
const role = localStorage.getItem("role")
if(role !== "supervisor"){
window.location.href = "/login"
}
},[])

export default function Page() {
  return <SupervisorDashboard />;
}