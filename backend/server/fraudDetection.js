function detectFraud(session){

const margin = session.margin

if(margin < -5){

return {
alert:true,
reason:"Material loss beyond tolerance"
}

}

if(margin > 10){

return {
alert:true,
reason:"Output unusually high"
}

}

return {alert:false}

}

module.exports = {
detectFraud
}