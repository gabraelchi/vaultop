import MDDashboard from "./md"

useEffect(()=>{
const role = localStorage.getItem("role")
if(role !== "md"){
window.location.href = "/login"
}
},[])

export default function Page(){
return <MDDashboard/>
}