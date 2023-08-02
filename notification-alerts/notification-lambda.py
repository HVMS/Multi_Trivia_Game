import json
import boto3
import time

webSocketClient = boto3.client("apigatewaymanagementapi", endpoint_url="https://0rs2czib7e.execute-api.us-east-1.amazonaws.com/production")
snsClient = boto3.client('sns')
notificationList = []
connectionId = ""
def lambda_handler(event, context):
    global connectionId
    print("EVENT IN LAMBDA====>", event)
    if(event.get('requestContext', False)):
        connectionId = event['requestContext']['connectionId']
        for notification in notificationList:
            webSocketClient.post_to_connection(ConnectionId=connectionId, Data=json.dumps({'output': notification}).encode('utf-8'))
            notificationList.remove(notification)
        
    if(event.get('Records', False)):
        for record in event['Records']:
            messageJson = json.loads(json.loads(record["body"]))
            if not messageJson.get('type', False) or not messageJson.get('message', False):
                return {
                    'statusCode': 400,
                    'body': json.dumps('Invalid Request')
                }
            notificationType = messageJson['type']
            message = messageJson['message']
            if notificationType == 'EMAIL':
                response = snsClient.publish(TopicArn='arn:aws:sns:us-east-1:028513566686:trivia-notification-sns-topic', Message=message)
                print("Message published")
            elif notificationType == 'PUSH':
                if connectionId != "":
                    webSocketClient.post_to_connection(ConnectionId=connectionId, Data=json.dumps({'output': message}).encode('utf-8'))
                else:
                    print("INFO: notification stored in list until websocket connection")
                    notificationList.append(message)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Notification Lambda!')
    }