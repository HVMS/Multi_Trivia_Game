import json
import boto3
import os
import uuid
import random

def lambda_handler(event, context):
    # TODO implement
    
    question_id = generate_unique_id()
    questionText = event['questionText']
    options = event['options']
    question_category = event['category']
    difficulty_level = event['difficulty']
    
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
        'headers': {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Headers':'Content-Type',
            'Content-Type': 'application/json'
        },
        'body': json.dumps({"message": "Successfully items are added"})
    }
    
def generate_unique_id():
    unique_id = str(uuid.uuid4().int)[:4]
    return unique_id