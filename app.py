from __future__ import unicode_literals
import os
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage

import configparser
import requests
import random

from requests.exceptions import SSLError

app = Flask(__name__)

# LINE 聊天機器人的基本資料
config = configparser.ConfigParser()
config.read('config.ini')

line_bot_api = LineBotApi(config.get('line-bot', 'channel_access_token'))
handler = WebhookHandler(config.get('line-bot', 'channel_secret'))


# 接收 LINE 的資訊
@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']

    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    try:
        print(body, signature)
        handler.handle(body, signature)

    except InvalidSignatureError:
        abort(400)

    return 'OK'


helpMessage = "`create task <task_name>` to create a task.\n" \
    + "`read tasks` to get all the tasks you created.\n" \
    + "`update task <task_id>` to update the content of the task.\n" \
    + "`delete task <task_id>` to remove the task.\n" \
    + "`get id` to get the task's ID for operations later."


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    if "read tasks" in event.message.text:
        try:
            response = requests.get("http://localhost:8000/api/task/")
            res = ""
            for item in response.json():
                res += '*' + item['name'] + '\n'
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text=res))
        except:
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="something wents wrong, please retry..."))
    elif "update task" in event.message.text:
        line_bot_api.reply_message(
            event.reply_token, TextSendMessage(text="soorry about that, I'm still working on it.."))
    #     try:
    #         taskID = event.message.text.split("task")[1].strip()
    #         requests.put("http://localhost:8000/api/task/%s" % taskID, )

    #     except:
    #         line_bot_api.reply_message(
    #             event.reply_token, TextSendMessage(text="something wents wrong, please retry..."))
    elif "delete task" in event.message.text:
        try:
            taskID = event.message.text.split("task")[1].strip()
            requests.delete("http://localhost:8000/api/task/%s" % taskID)
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="delete success!"))
        except:
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="something wents wrong, please retry..."))

    elif "create task" in event.message.text:
        try:
            taskName = event.message.text.split("task")[1].strip()
            requests.post("http://localhost:8000/api/task/",
                          json={"name": taskName})
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="create success!"))
        except:
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="something wents wrong, please retry..."))
    elif "get id" in event.message.text:
        try:
            response = requests.get("http://localhost:8000/api/task/")
            res = ""
            for item in response.json():
                res += '*' + item['_id'] + '\n'
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text=res))
        except:
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="something wents wrong, please retry..."))
    elif "help" in event.message.text:
        line_bot_api.reply_message(
            event.reply_token, TextSendMessage(text=helpMessage))
    # else:
        #line_bot_api.reply_message(event.reply_token, TextSendMessage(text=event.message.text))


if __name__ == "__main__":
    app.run()
