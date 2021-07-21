from flask import Flask, request, abort

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
)

app = Flask(__name__)

# access_token & chanel_id
line_bot_api = LineBotApi(
    'vkB5D5SxgqQxP1xGeSCs7+//PyCFtx+t+bu41aiCdo3Ty8cu8NPh24/BbByGkQJ91KSuY1cOtI55EOntGm4lBQsTMe9e6Cr+K9nyDX8S+SRpfvnJjtp2eQClPl2XeyQ/n1W2WJtJzD5OVNUKH5HMtgdB04t89/1O/w1cDnyilFU=')
handler = WebhookHandler('76a2d94b3ed2c7e0ed33d5700c1883a5')


@app.route("/callback", methods=['POST'])
def callback():
    # get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

    # get request body as text
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    # handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        print("Invalid signature. Please check your channel access token/channel secret.")
        abort(400)

    return 'OK'


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=event.message.text))


if __name__ == "__main__":
    app.run()
