import AdminDashboard from "./admin"


useEffect(()=>{
const role = localStorage.getItem("role")
if(role !== "admin"){
window.location.href = "/login"
}
},[])

export default function Page(){
return <AdminDashboard/>
}