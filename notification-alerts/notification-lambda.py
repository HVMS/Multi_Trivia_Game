# Author: Keyur Khant (ky468409@dal.ca)
# Date: 2023-08-05

# Import necessary libraries
import json
import boto3
import time

# Creating clients for AWS services
webSocketClient = boto3.client("apigatewaymanagementapi", endpoint_url="https://0rs2czib7e.execute-api.us-east-1.amazonaws.com/production")
snsClient = boto3.client('sns')

# Initializing an empty list for storing notifications
notificationList = []

# Initializing an empty string for storing connection ID
connectionId = ""

# Defining the lambda handler function
def lambda_handler(event, context):
    # Accessing the global variable connectionId
    global connectionId

    # Printing the received event data
    print("EVENT IN LAMBDA====>", event)
    
    # Check if requestContext exists in the event data and process accordingly
    if(event.get('requestContext', False)):
        # Get connectionId from the event data
        connectionId = event['requestContext']['connectionId']
        for notification in notificationList:
            # Post notifications to the connected client
            webSocketClient.post_to_connection(ConnectionId=connectionId, Data=json.dumps({'output': notification}).encode('utf-8'))
            # Remove sent notifications from the list
            notificationList.remove(notification)
    
    # Check if Records exist in the event data and process accordingly
    if(event.get('Records', False)):
        for record in event['Records']:
            # Parse the JSON message
            messageJson = json.loads(json.loads(record["body"]))
            # Check if the necessary fields are present in the message
            if not messageJson.get('type', False) or not messageJson.get('message', False):
                return {
                    'statusCode': 400,
                    'body': json.dumps('Invalid Request')
                }
            # Extract the type and the message from the parsed JSON
            notificationType = messageJson['type']
            message = messageJson['message']
            # If type is EMAIL, publish the message to an SNS topic
            if notificationType == 'EMAIL':
                response = snsClient.publish(TopicArn='arn:aws:sns:us-east-1:028513566686:trivia-notification-sns-topic', Message=message)
                print("Message published")
            # If type is PUSH, send the message to the connected client
            elif notificationType == 'PUSH':
                if connectionId != "":
                    webSocketClient.post_to_connection(ConnectionId=connectionId, Data=json.dumps({'output': message}).encode('utf-8'))
                else:
                    print("INFO: notification stored in list until websocket connection")
                    # Store the message in the list if no client is connected
                    notificationList.append(message)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Notification Lambda!')
    }
