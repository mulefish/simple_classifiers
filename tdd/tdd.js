const {
    yellow, green, verdict, cyan
} = require("../utils/utils.js")

const { Seen, populate } = require("../training/MDNB.js")


const test_Seen_object = () => { 
    const x = new Seen("Outlook")

    x.addObservation('Rainy','No')
    x.addObservation('Rainy', 'No')
    x.addObservation('Overcast', 'Yes')
    x.addObservation('Sunny', 'Yes')
    x.addObservation('Sunny', 'Yes')
    x.addObservation('Sunny', 'No')
    x.addObservation('Overcast', 'Yes')
    x.addObservation('Rainy', 'No')
    x.addObservation('Rainy', 'Yes')
    x.addObservation('Sunny', 'Yes')
    x.addObservation('Rainy', 'Yes')
    x.addObservation('Overcast', 'Yes')
    x.addObservation('Overcast', 'Yes')
    x.addObservation('Sunny', 'No')

    const expected = {
        No: {
            Rainy: 3, 
            Sunny: 2, 
            subtotal: 5
        },
        Yes: {
            Overcast: 4,
            Sunny: 3, 
            Rainy: 2, 
            subtotal: 9
        }
    }
    const actual = x.getMatrix()
    const isOk = verdict(expected, actual, "test_seen_object")
    if ( isOk === false ) {
        green(actual)
        cyan(expected)
    }


}



if (require.main === module) {
    const main = async (path_to_data, empty_matrix) => { 
        test_Seen_object()
        const matrix = {
            Outlook: new Seen("Outlook"),
            Temperature: new Seen("Temperature"),
            Humidity: new Seen("Humidity"),
            Windy: new Seen("Windy")
        }
        await populate("./weather.csv", matrix)
    }
    main()



}