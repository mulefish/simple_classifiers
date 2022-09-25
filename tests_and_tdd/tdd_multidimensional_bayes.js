


const {
    verdict, closeEnough
} = require("../utils/utils.js")

const { read_csv_file, getMatrix, getPredictions, train, beginTraining, get_sum_of_labels, classify } = require("../training/main_multidimensional_bayesian.js")


const get_data_via_file_test = async () => {
    const dependentVariables = ["Outlook", "Temperature", "Humidity", "Windy"]
    const prediction = "Play"
    const actual = await read_csv_file("./../data/weather.csv", dependentVariables, prediction)
    const expected = { "predictions": { "No": 5, "Yes": 9 }, "matrix": { "Outlook": { "No": { "Rainy": 3, "Sunny": 2 }, "Yes": { "Overcast": 4, "Sunny": 3, "Rainy": 2 } }, "Temperature": { "No": { "Hot": 2, "Cool": 1, "Mild": 2 }, "Yes": { "Hot": 2, "Mild": 4, "Cool": 3 } }, "Humidity": { "No": { "High": 4, "Normal": 1 }, "Yes": { "High": 3, "Normal": 6 } }, "Windy": { "No": { "False": 2, "True": 3 }, "Yes": { "False": 6, "True": 3 } } } }
    verdict(actual, expected, "get_data_test: read csv file")
    return actual
}

const set_data_explicitly_test = async (expected) => {
    beginTraining()

    train({ "Outlook": "Rainy", "Temperature": "Hot", "Humidity": "High", "Windy": "False" }, 'No')
    train({ "Outlook": "Rainy", "Temperature": "Hot", "Humidity": "High", "Windy": "True" }, 'No')
    train({ "Outlook": "Overcast", "Temperature": "Hot", "Humidity": "High", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Mild", "Humidity": "High", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Cool", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Cool", "Humidity": "Normal", "Windy": "True" }, 'No')
    train({ "Outlook": "Overcast", "Temperature": "Cool", "Humidity": "Normal", "Windy": "True" }, 'Yes')
    train({ "Outlook": "Rainy", "Temperature": "Mild", "Humidity": "High", "Windy": "False" }, 'No')
    train({ "Outlook": "Rainy", "Temperature": "Cool", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Mild", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Rainy", "Temperature": "Mild", "Humidity": "Normal", "Windy": "True" }, 'Yes')
    train({ "Outlook": "Overcast", "Temperature": "Mild", "Humidity": "High", "Windy": "True" }, 'Yes')
    train({ "Outlook": "Overcast", "Temperature": "Hot", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Mild", "Humidity": "High", "Windy": "True" }, 'No')

    const matrix = getMatrix()
    const predictions = getPredictions()

    const p = { "No": 5, "Yes": 9 }
    const m = { "Outlook": { "No": { "Rainy": 3, "Sunny": 2 }, "Yes": { "Overcast": 4, "Sunny": 3, "Rainy": 2 } }, "Temperature": { "No": { "Hot": 2, "Cool": 1, "Mild": 2 }, "Yes": { "Hot": 2, "Mild": 4, "Cool": 3 } }, "Humidity": { "No": { "High": 4, "Normal": 1 }, "Yes": { "High": 3, "Normal": 6 } }, "Windy": { "No": { "False": 2, "True": 3 }, "Yes": { "False": 6, "True": 3 } } }

    verdict(matrix, m, "set_data_explicitly_test: matrix")
    verdict(predictions, p, "set_data_explicitly_test: predictions")

    return { predictions, matrix }
}
const test_get_probabilityA_programmatically = () => {
    const prediction = "Yes"
    const seek = {
        Outlook: "Sunny",
        Temperature: "Hot",
        Humidity: "Normal",
        Windy: "False"
    }
    const A = get_sum_of_labels(seek, prediction)
    const isOk = closeEnough(A, 0.001, 0.021164021164021163)
    verdict(isOk, true, "test_get_probabilityA_programmatically: " + A)
}

const test_get_the_answer = () => {
    const prediction = "Yes"
    const seek = {
        Outlook: "Sunny",
        Temperature: "Hot",
        Humidity: "Normal",
        Windy: "False"
    }
    const A = get_sum_of_labels(seek, prediction)
    const isOk = closeEnough(A, 0.001, 0.021164021164021163)
    // green("A=" + A )

    const B = get_sum_of_labels(seek, "No")
    // green("B=" + B )


    const all = A + B 
    const yep = A / all 
    const nah = B / all 

    const actual = {
        yep, 
        nah
    }
    const expected = { yep: 0.8223684210526315, nah: 0.17763157894736847 }
    verdict(actual, expected, "test_get_the_answer: " + JSON.stringify(actual))
}

const test_get_probabilityA_manually = () => {
    // today = (Sunny, Hot, Normal, False)
    // Numbers from the 'weather.csv' data
    const sunny = 3 / 9 // sunny and 'yes'
    const hot = 2 / 9 // hot and 'yes'
    const normalHumid = 6 / 9 // norm humid and 'yes'
    const noWind = 6 / 9 // no wind and 'yes'
    const yes = 9 / 14 // overall 'yes'

    const total = sunny * hot * normalHumid * noWind * yes
    const isOk = closeEnough(total, 0.001, 0.021164021164021163)
    verdict(isOk, true, "test_get_probabilityA_manually: " + total)
}

const test_get_answer_manually = () => {
    // today = (Sunny, Hot, Normal, False)
    // Numbers from the 'weather.csv' data
    const sunny = 3 / 9 // sunny and 'yes'
    const hot = 2 / 9 // hot and 'yes'
    const normalHumid = 6 / 9 // norm humid and 'yes'
    const noWind = 6 / 9 // no wind and 'yes'
    const yes = 9 / 14 // overall 'yes'

    const total = sunny * hot * normalHumid * noWind * yes

    const sunny2 = 2 / 5 // sunny and 'no'
    const hot2 = 2 / 5 // hot and 'no'
    const normalHumid2 = 1 / 5 // norm humid and 'no'
    const noWind2 = 2 / 5 // no wind and 'no'
    const yes2 = 5 / 14 // overall 'no'

    const total2 = sunny2 * hot2 * normalHumid2 * noWind2 * yes2

    const all = total + total2 
    const yep = total / all 
    const nah = total2 / all 

    const actual = {
        yep, 
        nah
    }

    const expected = { yep: 0.8223684210526315, nah: 0.17763157894736847 }
    verdict(actual, expected, "test_get_answer_manually: " + JSON.stringify(actual))
}

const test_classify_ThisWillBeCloseToTheNormalWayToUseThis = () => { 
    // Zero stuff out!
    beginTraining() 

    // Populate the data! 
    train({ "Outlook": "Rainy", "Temperature": "Hot", "Humidity": "High", "Windy": "False" }, 'No')
    train({ "Outlook": "Rainy", "Temperature": "Hot", "Humidity": "High", "Windy": "True" }, 'No')
    train({ "Outlook": "Overcast", "Temperature": "Hot", "Humidity": "High", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Mild", "Humidity": "High", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Cool", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Cool", "Humidity": "Normal", "Windy": "True" }, 'No')
    train({ "Outlook": "Overcast", "Temperature": "Cool", "Humidity": "Normal", "Windy": "True" }, 'Yes')
    train({ "Outlook": "Rainy", "Temperature": "Mild", "Humidity": "High", "Windy": "False" }, 'No')
    train({ "Outlook": "Rainy", "Temperature": "Cool", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Mild", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Rainy", "Temperature": "Mild", "Humidity": "Normal", "Windy": "True" }, 'Yes')
    train({ "Outlook": "Overcast", "Temperature": "Mild", "Humidity": "High", "Windy": "True" }, 'Yes')
    train({ "Outlook": "Overcast", "Temperature": "Hot", "Humidity": "Normal", "Windy": "False" }, 'Yes')
    train({ "Outlook": "Sunny", "Temperature": "Mild", "Humidity": "High", "Windy": "True" }, 'No')

    // Look for this!
    const findThis = {
        Outlook: "Sunny",
        Temperature: "Hot",
        Humidity: "Normal",
        Windy: "False"
    }

    // Get the result!
    const result = classify(findThis)

    // Judge the result! 
    const expected = {"prediction": "Yes","score": 0.021164021164021163}
    verdict(result, expected, "This is close to a real world usage. And it found: " + JSON.stringify( result ) ) 
}

if (require.main === module) {
    const main = async () => {
        await get_data_via_file_test()
        set_data_explicitly_test()
        test_get_probabilityA_manually()
        test_get_probabilityA_programmatically()
        test_get_answer_manually()
        test_get_the_answer()
        test_classify_ThisWillBeCloseToTheNormalWayToUseThis() 
    }
    main()
}
