function machineAnalytics(session){

const runtime = session.end - session.start

const efficiency = session.output / session.kg

return{
runtime,
efficiency
}

}

module.exports={machineAnalytics}