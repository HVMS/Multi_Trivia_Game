import functions_framework
import boto3

@functions_framework.http
def hello_http(request):
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    else:
        headers = {"Access-Control-Allow-Origin": "*"}
    dynamodb = boto3.resource('dynamodb', aws_access_key_id='ASIAVKCOTW4TO43WQSQM', aws_secret_access_key='9toDxJ4dOZnp7oX7gyRxH8/+ychB+IZhsjkKMI4c', region_name='us-east-1',
                            aws_session_token='FwoGZXIvYXdzECQaDFbqRY1GVFnC8Bs7vSLAAdgVX2N5KSf7bNOqvRcmFgWSwOE+zdgFf6cKSvwv06xulfnZ9H4qQzKRZfCYyuMfSxcYCw5iqn2Yh/+NX5gFgFvUXXXGAHNCWivapeSX2/v9Yx1vFgHtC3MNNChHoeO8yH46lodaWFbg91snwmFxW7+n+o+xTrAU34/LbHqUszrgqd0Bu3i9s7uc7RptDvQXgWDAKeKvwvj4eiJdq9f5+FJTziZN/DQk1NeNkBunDTGmkmLD/fl0pptko3XKovJ/uiiu4pqmBjItbq0fPDu22QQg3lquEmCvcGokPn/j54pXXul3bRJVg2iJvU/Mo3zuKxtyJGBj')

    table = dynamodb.Table('trivia_game')
    tableData = table.scan()
    category_filter = request.args.get('category')
    difficulty_filter = request.args.get('difficulty')
    timeframe_filter = request.args.get('timeframe')

    if not tableData['Items']:
        return ([], 200, headers)

    filtered_data = tableData['Items']
    if category_filter:
        filtered_data = [game for game in filtered_data if category_filter in game['categories']]
    if difficulty_filter:
        filtered_data = [game for game in filtered_data if game['difficulty_level'] == int(difficulty_filter)]
    if timeframe_filter:
        filtered_data = [game for game in filtered_data if int(game['timeframe']) <= int(timeframe_filter)]

    return (filtered_data, 200, headers)