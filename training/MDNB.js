const csv = require('csv-parser')
const {
    yellow, green, cyan, red
} = require("../utils/utils.js")
const fs = require('fs')



class Seen {

    constructor(category) {
        this.category = category
        this.seen = {}
    }

    // prediction will be 'Yes' or 'No' or maybe 'Skirt', 'Suit', 'Pants' or maybe... 
    // I.e., the prediction will be the CATEGORIES into which one which to categorize things
    //
    // dependent will be 'Raining', 'Sunny', 'Windy'...   ...i.e., dependent features/dimensions
    // about the dataset  
    addObservation(dependent, prediction) {
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
        for ( let prediction in this.seen ) {
            let subtotal = 0 
            for ( let observations in this.seen[prediction]) {
                subtotal += this.seen[prediction][observations]
            }
            this.seen[prediction]['subtotal'] = subtotal
        }
        return this.seen
    }
}

async function read_the_data(path_to_file, matrix) {
    return new Promise((resolve, reject) => {

        let i = 0
        fs.createReadStream(path_to_file)
            .pipe(csv())
            .on('data', (data) => {
                if (i === 1) {
                    // green(data)
                }
                i++
            })
            .on('end', () => {
                resolve(matrix)
            });
    });
}

const populate = async (path_to_data, empty_matrix) => { 
    const x = await read_the_data(path_to_data, empty_matrix)
} 


if (require.main === module) {
    const main = async (path_to_data, empty_matrix) => { 
        const matrix = {
            Outlook: new Seen("Outlook"),
            Temperature: new Seen("Temperature"),
            Humidity: new Seen("Humidity"),
            Windy: new Seen("Windy")
        }
        await populate("./weather.csv", matrix)
        cyan("The end")
    }
    main()
}

module.exports = { Seen, populate }
