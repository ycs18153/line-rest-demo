from __future__ import unicode_literals
import os
from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import (MessageEvent, TextMessage,
                            TextSendMessage, TemplateSendMessage, FlexSendMessage, ConfirmTemplate, URIAction, MessageAction, PostbackEvent)
import configparser
from linebot.models.events import Postback
import requests
import random
import json
import logging
import datetime
import copy
from requests.exceptions import SSLError
from magicMessage.carousel import todo, new_info

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


helpMessage = "`create` to create a task.\n" \
    + "`read` to get all the tasks you created.\n" \
    + "`update <todo_id>` to update the content of the task.\n" \
    + "`delete <todo_id>` to remove the task.\n" \
    + "`get id` to get the task's ID for operations later."


@handler.add(PostbackEvent)
def postbackReply(event):
    data = event.postback.data
    print(data)


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    if "read" in event.message.text:
        try:
            response = requests.get(
                f'https://tsmcbot-404notfound.du.r.appspot.com/api/todo/{event.source.user_id}', timeout=5)
            each_todo = response.json()
            todo_copy = {}
            todo_copy = copy.deepcopy(todo)

            for i in range(len(each_todo)):
                new_info_copy = {}
                new_info_copy = copy.deepcopy(new_info)
                new_info_copy["header"]["contents"][1]["text"] = each_todo[i]["todo_id"]
                new_info_copy["body"]["contents"][0]["contents"][1]["text"] = each_todo[i]["todo_name"]
                new_info_copy["body"]["contents"][1]["contents"][1]["text"] = each_todo[i]["todo_date"][5:10] + \
                    " "+each_todo[i]["todo_date"][11:16]
                new_info_copy["body"]["contents"][2]["contents"][1]["text"] = each_todo[i]["todo_contents"]
                new_info_copy["body"]["contents"][3]["contents"][1]["text"] = str(
                    each_todo[i]["todo_update_date"])
                new_info_copy["body"]["contents"][4]["contents"][1]["text"] = str(
                    each_todo[i]["todo_completed"])
                todo_copy["contents"].append(new_info_copy)
            message = FlexSendMessage(alt_text="todo list", contents=todo_copy)
            line_bot_api.reply_message(event.reply_token, message)

        except Exception as e:
            logging.error('Error Msg: ',  exc_info=e)
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="something wents wrong, please retry..."))

    elif "delete" in event.message.text:
        try:
            todo_id = event.message.text.split(" ")[1].strip()
            requests.delete(
                f'https://tsmcbot-404notfound.du.r.appspot.com/api/todo/{event.source.user_id}/{todo_id}')
            response = requests.get(
                f'https://tsmcbot-404notfound.du.r.appspot.com/api/todo/{event.source.user_id}')
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text=f'delete success!\n{str(response.json())}'))
        except:
            line_bot_api.reply_message(
                event.reply_token, TextSendMessage(text="something wents wrong, please retry..."))
    elif "test" in event.message.text:
        line_bot_api.reply_message(
            event.reply_token, TextSendMessage(text="test"))


if __name__ == "__main__":
    app.run()
