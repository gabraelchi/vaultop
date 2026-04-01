const WebSocket = require("ws")

let activeSession = null

const materialYield = {
PET: 5.8,
HDPE: 4.5,
PVC: 3.2,
NYLON: 6.1
}


// CALCULATE EXPECTED OUTPUT
function calculateExpected(material, kg){

const rate = materialYield[material] || 1

return kg * rate

}


// FRAUD DETECTION
function detectFraud(session){

if(session.margin < -5){

return {
alert:true,
reason:"Material loss beyond tolerance"
}

}

return {alert:false}

}


// START WEBSOCKET SERVER
const wss = new WebSocket.Server({ port: 4000 })

let clients = []

console.log("Production engine running on port 4000")


// NEW CONNECTION
wss.on("connection",(ws)=>{

console.log("Client connected")

clients.push(ws)


// SEND CURRENT ACTIVE SESSION IF ONE EXISTS
if(activeSession){

ws.send(JSON.stringify({
type:"SESSION_STARTED",
session:activeSession
}))

}


// REMOVE CLIENT WHEN DISCONNECTED
ws.on("close",()=>{

clients = clients.filter(client => client !== ws)

console.log("Client disconnected")

})


// RECEIVE MESSAGE
ws.on("message",(msg)=>{

let data

try{
data = JSON.parse(msg)
}catch{
console.log("Invalid JSON received")
return
}



//////////////////////////
// START SESSION
//////////////////////////

if(data.type === "START_SESSION"){

if(activeSession){

console.log("Session already running")

return
}

const expected = calculateExpected(
data.material,
data.kg
)

activeSession = {

id:Date.now(),

material:data.material,

operator:data.operator,

kg:data.kg,

expectedOutput:expected,

startTime:new Date()

}

console.log("SESSION STARTED:", activeSession)

broadcast({
type:"SESSION_STARTED",
session:activeSession
})

}



//////////////////////////
// STOP SESSION
//////////////////////////

if(data.type === "STOP_SESSION"){

if(!activeSession){

console.log("No active session")

return
}

activeSession.actualOutput = Number(data.output)

activeSession.margin =
activeSession.actualOutput - activeSession.expectedOutput

activeSession.endTime = new Date()

const fraud = detectFraud(activeSession)

console.log("SESSION COMPLETED:", activeSession)

broadcast({
type:"SESSION_COMPLETED",
session:activeSession,
fraud
})

activeSession = null

}

})

})


// BROADCAST TO ALL CONNECTED CLIENTS
function broadcast(message){

console.log("Broadcasting:", message.type)

clients.forEach(client=>{

if(client.readyState === WebSocket.OPEN){

client.send(JSON.stringify(message))

}

})

}