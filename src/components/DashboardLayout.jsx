"use client"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function DashboardLayout({children}){

return(

<div className="flex h-screen bg-[#020617] text-white">

<Sidebar/>

<div className="flex-1 flex flex-col">

<Topbar/>

<div className="p-8 overflow-auto flex-1">

{children}

</div>

</div>

</div>

)

}