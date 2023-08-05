# Author: Keyur Khant (ky468409@dal.ca)
# Date: 2023-08-05

# Importing the necessary libraries
import functions_framework
import boto3

# Defining a cloud function that is triggerable via an HTTP request
@functions_framework.http
def hello_http(request):
    
    # Handles preflight request, typically a CORS mechanism in web browsers
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",  # Allow all origins
            "Access-Control-Allow-Methods": "GET",  # Allow only GET requests
            "Access-Control-Allow-Headers": "Content-Type"  # Allow headers of type "Content-Type"
        }
    else:
        headers = {"Access-Control-Allow-Origin": "*"}  # For all other requests, allow all origins
    
    # Connect to AWS DynamoDB using boto3. Use your own access and secret key.
    dynamodb = boto3.resource('dynamodb', aws_access_key_id='AKIAQNI4KP7PLUIMIZXL', 
                              aws_secret_access_key='o98JnbtyjH6hkHQl8ykWXeWdDOjmHLQ+P2V1i7ed', 
                              region_name='us-east-1')
    
    # Accessing the DynamoDB table 'Trivia_Games'
    table = dynamodb.Table('Trivia_Games')
    
    # Scanning the table to retrieve all data
    tableData = table.scan()
    
    # Printing the retrieved data
    print(tableData)
    
    # Fetching the request parameters
    category_filter = request.args.get('category')
    difficulty_filter = request.args.get('difficulty')
    timeframe_filter = request.args.get('timeframe')
    
    # If no data present in table return an empty list with a status code of 200
    if not tableData['Items']:
        return ([], 200, headers)
    
    # By default, consider all data items for filtering
    filtered_data = tableData['Items']
    
    # If category filter is provided, apply the filter on the data
    if category_filter:
        filtered_data = [game for game in filtered_data if game['gameCategory'] == category_filter]
    
    # If difficulty filter is provided, apply the filter on the data
    if difficulty_filter:
        filtered_data = [game for game in filtered_data if game['gameDifficultyLevel'] == difficulty_filter]
    
    # If timeframe filter is provided, apply the filter on the data
    if timeframe_filter:
        filtered_data = [game for game in filtered_data if int(game['gameTimeFrame']) <= int(timeframe_filter)]

    # Return the filtered data with a status code of 200
    return (filtered_data, 200, headers)
