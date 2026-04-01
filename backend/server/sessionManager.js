const {calculateExpectedOutput} = require("./marginEngine")

let activeSession = null

function startSession(data){

const expectedOutput = calculateExpectedOutput(
data.material,
data.kg
)

activeSession = {

id: Date.now(),

material:data.material,

kg:data.kg,

expectedOutput,

startTime:new Date()

}

return activeSession

}

function stopSession(output){

if(!activeSession) return null

activeSession.actualOutput = output

activeSession.margin =
output - activeSession.expectedOutput

activeSession.endTime = new Date()

const completedSession = activeSession

activeSession = null

return completedSession

}

module.exports = {
startSession,
stopSession
}