const {getMaterialYield} = require("./materialConfig")

function calculateExpectedOutput(material,kg){

const rate = getMaterialYield(material)

return kg * rate

}

function calculateMargin(expected,actual){

return actual - expected

}

module.exports = {
calculateExpectedOutput,
calculateMargin
}