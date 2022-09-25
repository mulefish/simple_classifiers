const csv = require('csv-parser')
const fs = require('fs')
const { red } = require('../utils/utils')

let predictions = {}     
let matrix = {}
function getMatrix() {
    return matrix
}
function getPredictions() { 
    return predictions
}
function beginTraining() {
    predictions = {}     
    matrix = {}    
}

function get_sum_of_labels(labels, prediction) {
    let probs = []
    const p = predictions[prediction]
    for ( let label in labels ) {
        const value = labels[label]
        const n = matrix[label][prediction][value]
        probs.push(n / p)
    }
    let allThePredictions = 0 
    for ( let k in predictions ) {
        allThePredictions += predictions[k]
    }
    probs.push(p / allThePredictions)
    let result = probs[0] 
    for ( let i = 1; i < probs.length; i++ ) { 
        result *= probs[i] 
    }

    return result
}

function train( information, prediction) {
    // dependents!
    for ( let label in information ) { 
        let value = information[label]        
        if ( ! matrix.hasOwnProperty(label) ) {
            matrix[label] = {}
        }
        if ( ! matrix[label].hasOwnProperty(prediction)) {
            matrix[label][prediction] = {}
        }
        if ( ! matrix[label][prediction].hasOwnProperty(value)) {
            matrix[label][prediction][value] = 1
        } else {
            matrix[label][prediction][value]++
        }
    } 
    // predictions!
    if ( predictions.hasOwnProperty(prediction)) {
        predictions[prediction]++
    } else {
        predictions[prediction] = 1
    }
}
async function read_csv_file(path_to_file, dependentLabels, prediction) {
    predictions = {}     
    matrix = {}
    return new Promise((resolve, reject) => {
        let rowIndex = 0 
        fs.createReadStream(path_to_file)
            .pipe(csv())
            .on('data', (row) => {
                    let information = {} 
                    dependentLabels.forEach((label)=> {
                        information[label] = row[label]
                    })
                    train( information, row[prediction])
                rowIndex++
            })
            .on('end', () => {
                resolve({ predictions, matrix} )
            });
    });
}

function classify(labels) { 
    let score = 0 
    let found = undefined
    for ( let prediction in predictions ) {
        const s = get_sum_of_labels(labels, prediction)
        if ( score < s ) {
            score = s
            found = prediction
        }
    }
    return { prediction:found, score: score }
}

// This entire require.main stuff is NOT needed. It is here just to show me, in a year's time, how to run this. 
if (require.main === module) {
    red("BEGIN DEMO CODE")
    const main = async (path_to_data, empty_matrix) => { 
        const dependentVariables = ["Outlook", "Temperature", "Humidity", "Windy"]
        const prediction = "Play"
        await read_csv_file("./../data/weather.csv", dependentVariables, prediction)

        // See? The 'findThis' lables are all possibliblities inside to weather.csv file. An weird kittycats or dinosaurs. 
        const findThis = {
            Outlook: "Sunny",
            Temperature: "Hot",
            Humidity: "Normal",
            Windy: "False"
        }
        const result = classify(findThis)
        red("DEMONSTRATION CODE FOUND: " + JSON.stringify(result) )
        red("END DEMO CODE")    
    }
    main()

}
module.exports = { read_csv_file, getMatrix,getPredictions,train, beginTraining, get_sum_of_labels, classify  }