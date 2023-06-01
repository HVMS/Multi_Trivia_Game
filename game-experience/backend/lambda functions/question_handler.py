import json
import boto3
import os

def lambda_handler(event, context):
    # TODO implement
    
    message = event['body']['questions_data']
    print(message)
    
    question_id = message['question_id']
    questionText = message['questionText']
    options = message['options']
    question_category = message['question_category']
    difficulty_level = message['difficulty_level']
    
    dynamodb_client = boto3.client('dynamodb')
    table_name = os.environ['TABLE_NAME']
    
    # Prepare items to store into table
    item = {
        'question_id': {'S': question_id},
        'questionText': {'S': questionText},
        'options': {'L': [{'S': option } for option in options]},
        'question_category' : {'S': question_category},
        'difficulty_level' : {'S': difficulty_level}
    }
    
    try:
        # TODO: write code...
        table_response = dynamodb_client.describe_table(TableName=table_name)
    except dynamodb_client.exceptions.ResourceNotFoundException:
        
        create_table_response = dynamodb_client.create_table(
            AttributeDefinitions=[
                {
                    'AttributeName': 'question_id',
                    'AttributeType': 'S'
                },
            ],
            TableName = table_name,
            KeySchema=[
                {
                    'AttributeName': 'question_id',
                    'KeyType': 'HASH'
                },
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
            )
        
        dynamodb_client.get_waiter('table_exists').wait(TableName=table_name)
        
    dynamodb_client.put_item(TableName=table_name, Item=item)
    
    return {
        'statusCode': 200,
        'body': json.dumps("Successfully items are added")
    }