const {
    yellow, green, verdict, cyan
} = require("../utils/utils.js")

const { Seen, populate, prepMatrix } = require("../training/MDNB.js")


const test_Seen_object = () => {
    const x = new Seen()

    x.train('Rainy', 'No')
    x.train('Rainy', 'No')
    x.train('Overcast', 'Yes')
    x.train('Sunny', 'Yes')
    x.train('Sunny', 'Yes')
    x.train('Sunny', 'No')
    x.train('Overcast', 'Yes')
    x.train('Rainy', 'No')
    x.train('Rainy', 'Yes')
    x.train('Sunny', 'Yes')
    x.train('Rainy', 'Yes')
    x.train('Overcast', 'Yes')
    x.train('Overcast', 'Yes')
    x.train('Sunny', 'No')

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
        },
        total: 14
    }
    const actual = x.getMatrix()
    const isOk = verdict(expected, actual, "test_seen_object")
    if (isOk === false) {
        green(actual)
        cyan(expected)
    }
}

const test_smallCompleteWeatherRun = async () => {
    const step1 = {
        Outlook: new Seen("Outlook"),
        Temperature: new Seen("Temperature"),
        Humidity: new Seen("Humidity"),
        Windy: new Seen("Windy")
    }
    const rawMatrix = await populate("./../data/weather.csv", step1, "Play")
    const matrix = prepMatrix(rawMatrix)

    // Notice! What did called 'prepMatrix()' do? Well, 
    // rawMatrix would have seen { } in it and would not have the 'total' nor 'subTotal' that 'matrix' has
    const expected = {
        "Outlook": {
            "No": {
                "Rainy": 2,
                "Sunny": 2,
                "subtotal": 4
            },
            "Yes": {
                "Overcast": 4,
                "Sunny": 3,
                "Rainy": 2,
                "subtotal": 9
            },
            "total": 13
        },
        "Temperature": {
            "No": {
                "Hot": 1,
                "Cool": 1,
                "Mild": 2,
                "subtotal": 4
            },
            "Yes": {
                "Hot": 2,
                "Mild": 4,
                "Cool": 3,
                "subtotal": 9
            },
            "total": 13
        },
        "Humidity": {
            "No": {
                "High": 3,
                "Normal": 1,
                "subtotal": 4
            },
            "Yes": {
                "High": 3,
                "Normal": 6,
                "subtotal": 9
            },
            "total": 13
        },
        "Windy": {
            "No": {
                "True": 3,
                "False": 1,
                "subtotal": 4
            },
            "Yes": {
                "False": 6,
                "True": 3,
                "subtotal": 9
            },
            "total": 13
        }
    }
    const isOk = verdict(expected, matrix, "test_smallCompleteWeatherRun")
    if (isOk === false) {
        green(matrix)
        cyan(expected)
    }
}


if (require.main === module) {
    const main = async (path_to_data, empty_matrix) => {
        test_Seen_object()
        await test_smallCompleteWeatherRun()
    }
    main()
}