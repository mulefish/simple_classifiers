const csv = require('csv-parser')
const {
    yellow, green, cyan, red
} = require("../utils/utils.js")
const fs = require('fs')



class Seen {

    constructor(category) {
        // this.category = category
        this.seen = {}
    }

    // prediction will be 'Yes' or 'No' or maybe 'Skirt', 'Suit', 'Pants' or maybe... 
    // I.e., the prediction will be the CATEGORIES into which one which to categorize things
    //
    // dependent will be 'Raining', 'Sunny', 'Windy'...   ...i.e., dependent features/dimensions
    // about the dataset  
    train(dependent, prediction) {
        if (this.seen.hasOwnProperty(prediction)) {
            // We've seen this prediction before 
            if (this.seen[prediction].hasOwnProperty(dependent)) {
                // We've seen this observation for this prediction before  
                this.seen[prediction][dependent]++
            } else {
                // We've never this seen observation for this prediction before  
                this.seen[prediction][dependent] = 1
            }
        } else {
            // Never seen this prediction before
            this.seen[prediction] = {}
            if (this.seen[prediction].hasOwnProperty(dependent)) {
                // We've seen this observation for this prediction before  
                this.seen[prediction][dependent]++
            } else {
                // We've never this seen observation for this prediction before  
                this.seen[prediction][dependent] = 1
            }
        }
    }
    getMatrix() { 
        // Add up all the counts of all the dependent variables witnessed in all the prediction categories
        let total = 0 
        for ( let prediction in this.seen ) {
            let subtotal = 0 
            for ( let observations in this.seen[prediction]) {
                subtotal += this.seen[prediction][observations]
            }
            this.seen[prediction]['subtotal'] = subtotal
            total += subtotal
        }
        this.seen["total"] = total
        return this.seen
    }
}
// What does this func do? Two things: It flattens out a artifact of using a js class. I.e., This would have been a puzzling extra layer of 'seen'. 
// And two ( and more importantly ) it gets the subtotals for each of the dependent dimensions. 
function prepMatrix(rawMatrix) {
    let matrix = {} 
    for ( let prediction in rawMatrix ) {
        matrix[prediction] = rawMatrix[prediction].getMatrix()
    }
    return matrix
}


async function read_the_data(path_to_file, matrix, category) {
    return new Promise((resolve, reject) => {
        let i = 0
        fs.createReadStream(path_to_file)
            .pipe(csv())
            .on('data', (data) => {
                if (i === 0) {
                    // Just the headers, skip it!
                } else {
                    for ( let k in matrix ) {
                        const v = data[k]
                        const c = data[category]
                        matrix[k].train(v, c)
                    }
                }
                i++
            })
            .on('end', () => {
                resolve(matrix)
            });
    });
}

const populate = async (path_to_data, empty_matrix, category) => { 

    const populated_matrix = await read_the_data(path_to_data, empty_matrix, category)
    return populated_matrix
} 


if (require.main === module) {
    // Just a self test: Included here mostly to show how to use this.
    const main = async (path_to_data, empty_matrix) => { 
        const matrix = {
            Outlook: new Seen(),
            Temperature: new Seen(),
            Humidity: new Seen(),
            Windy: new Seen()
        }
        const x = await populate("./../data/weather.csv", matrix, "Play")
        cyan("The end")
    }
    main()
}
module.exports = { Seen, populate, prepMatrix }