import functions_framework

import boto3

@functions_framework.http
def hello_http(request):
    dynamodb = boto3.resource('dynamodb', aws_access_key_id='', aws_secret_access_key='', region_name='us-east-1', aws_session_token='')

    table = dynamodb.Table('trivia_game')
    tableData = table.scan()
    category_filter = request.args.get('category')
    difficulty_filter = request.args.get('difficulty')
    timeframe_filter = request.args.get('timeframe')

    if not tableData['Items']:
        return []

    filtered_data = tableData['Items']
    if category_filter:
        filtered_data = [game for game in filtered_data if category_filter in game['categories']]
    if difficulty_filter:
        filtered_data = [game for game in filtered_data if game['difficulty_level'] == int(difficulty_filter)]
    if timeframe_filter:
        filtered_data = [game for game in filtered_data if int(game['timeframe']) <= int(timeframe_filter)]

    return filtered_data