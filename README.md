# simple_classifiers
Naive Bayes Node

# Toy dataset: 
Outlook,Temperature,Humidity,Windy,Play
Rainy,Hot,High,False,No
Rainy,Hot,High,True,No
Overcast,Hot,High,False,Yes
Sunny,Mild,High,False,Yes
Sunny,Cool,Normal,False,Yes
Sunny,Cool,Normal,True,No
Overcast,Cool,Normal,True,Yes
Rainy,Mild,High,False,No
Rainy,Cool,Normal,False,Yes
Sunny,Mild,Normal,False,Yes
Rainy,Mild,Normal,True,Yes
Overcast,Mild,High,True,Yes
Overcast,Hot,Normal,False,Yes
Sunny,Mild,High,True,No
The first 4 columns are 'dependent features' and the 'Play' column is the 'response vector' ( i.e., it is the prediction )

# Assumption
The fundamental Naive Bayes assumption is that each feature makes an is INDEPENDENT and EQUAL in weight

# Formula  
```json
                {P(B|A) P(A)}     
 P(A|B) =   ______________________  
                    {P(B)}   
```                      
# url
A nice description + the data for the tests herein:   
https://www.geeksforgeeks.org/naive-bayes-classifiers/