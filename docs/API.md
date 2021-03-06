# API

All plain text GET requests must be made to \<ip>:\<port>/requests (e.g. 192.168.0.127:8741/requests). Requests for binary data (whether it be pictures from the camera roll, profile pictures, or attachments) must be sent to /data. All post requests must be directed to /send.

All request parameters require a value, but only some of the values are consequential. However, the app will not interpret a parameter as a parameter unless it has an accompanying value -- For example, to retrieve the list of conversations, one must make a request to /requests with a parameter of 'chat', but 'GET /requests?chat' will return nothing. Something like 'GET /requests?chat=0' will return the correct information.

Requests to all of these API endpoints besides `/requests?password` will return nothing, unless you authenticate first, at `/requests?password`. Details are under the first subsection of the `/requests` requests

# `/requests` requests:

All requests to `/requests` besides `?password` return JSON information. `?password` returns plain text.

The below sections detail the query key/value pairs that you can combine to get the information you need from the API.

## `password`

Authenticates with the server, so that you can retrieve more information from it.

- password: Parameter is necessary, and value is consequential. If yoyou pass in the same password as is specified in the main view of the app, it will return `false` as plain text. If it is the same password, it will return `true`, and you will be able to make further requests to other API endpoints.

Example queries:
- /requests?password=toor

## `person`, `num`, `offset`, `read`, `from`

Retrieves the most recent \$num messages to or from \$person, offset by \$offset.

- person: Parameter is necessary, and value is consequential; must be chat_identifier of conversation. chat_identifier will be the email address or phone number of an individual, or the chat_identifier for a group chat (normally the string 'chat' followed by 16-20 numerical digits). chat_identifiers for group chats and email addresses must be exact, and phone numbers must include the entire phone number (including country codes, area codes, and other identifiers where necessary), with a plus sign at the beginning, e.g. "+16378269173". Using parentheses or dashes will mess it up and return nothing.
&nbsp;&nbsp;&nbsp;&nbsp; As of version 0.5.4, you may also send multiple addresses to this parameter, separated by single commas, and it will return a merged text list with all of the texts from the listed addresses included. This can be useful if you'd like to treat multiple conversations as one, such as if you have multiple conversations for talking with one person.

- num: Parameter is not necessary, but value is consequential. The value of this parameter must be an integer, and will be the number of most recent messages that are returned from the app. If it is 0, it will return all the messages to or from this person, and if it is not specified, it will use the default number of messages on the app, which is currently 100 at the time of writing this.

- offset: Parameter is not necessary, but value is consequential. The value of this parameter must be an integer, and will be the offset off the messages that you want to receive. Say, for example, that you already retrieved the latest 100 messages, and wanted to receive the 100 before those, your offset would be 100. If unspecified, this value will default to 0.

- read: Parameter is not necessary, but value is consequential. The value of this parameter must be a string, either `true` or `false`. If it is `true`, or the parameter is not included but the 'mark conversation as read when viewed on web interface' option is checked in the app's settings, the conversation whose messages are being requested will be marked as read on the host device. 

- from: Parameter is not necessary, but value is consequential. The value of this parameter must be an int, either 0, 1, or 2. If you pass 0 for this key, this request will grab texts both to and from you in this conversation. If you pass 1 in for this key, it will grab only texts that are from you, and if you pass in 2, it will only grab texts that are to you.

Example queries:
- /requests?person=chat192370112946281736&num=500
- /requests?person=+15202621138&from=2
- /requests?person=email@icloud.com&num=50&offset=100&read=false
- /requests?person=person@gmail.com&offset=200
- /requests?person=email@icloud.com,+15202621138,person@gmail.com&num=100&read=true

## `chat`, `num_chats`, `chats_offset`

Retrieves the latest \$num_chats conversations

- chat: Parameter is necessary, and value is inconsequential. Calling the parameter 'chat' simply specifies that you are asking for a list of the conversations on the device.

- num_chats: Parameter is not necessary, and value is consequential. Value must be integer, and will specify how many conversations to get the information of. If unspecified, it will default to the device's default, which is, at the time of writing, 40. If it is 0, it will retrieve all chats.

- chats_offset: Parameter is not necessary, and value is consequential. Value must be an integer, and it will specify the offset of conversations to get. For example, if you've already retrieved the first 40 conversations, adn would like to retrieve the next 40, you would set both `num_chats` and `chats_offset` to 40. If this is not specified, it will default to 0.

Example queries:
- /requests?chat=0
- /requests?chat=0&num_chats=80
- /requests?chat=inconsequential&num_chats=80&offset=160

## `name`

Retrieves the contact name that accompanies chat_identifier \$name

- name: Parameter is necessary, and value is consequential. Value must be the chat_identifier for the contact whose name you want. It can get the name if given an email address or phone number of an individual, or the chat_identifier of a group chat. Email must be given in the regular format, and phone number must be given in the format that the above 'person' section specifies. If there is no name for the email address, phone number, or chat_identifier given, then it will return the given address (in the case of a phone number or email address) or list of recipients (in the case of a group chat chat_identifier)

Example queries:
- /requests?name=email@icloud.com
- /requests?name=+12761938272
- /requests?name=chat193827462058278283

## `search`, `case_sensitive`, `bridge_gaps`, `group_by`

This searches for the term \$search in all your texts. `case_sensitive`, `bridge_gaps`, and `group_by` are customization options.

- search: Parameter is necessary, and value is consequential. This must be the term you want to search for. Does not have to be surrounded by quotes. Case sensitivity is determined by the `case_sensitive` parameter.
- case_sensitive: Parameter is not necessary, and value is consequential; default is false. This determines whether or not you want the search to be case sensitive; a value of `true` make it sensitive, and `false` makes it insensitive
- bridge_gaps: Parameter is not necessary, and value is consequential; default is true. If set to true, this replaces all spaces with wildcard characters, allowing for the search term to be spaced out over a text. A value of `true` makes it true, and `false` makes it false
- group_by: Parameter is not necessary, and value is consequential; default is 'time'. This specifies if you would like the values to be returned as grouped by conversation, or ungrouped and ordered by date (most recent first). If you pass in 'time' or don't set this query parameter, it will return them ungrouped and with the most recent first. If you pass in anything else, it will group them by conversation.

Example queries:
- /requests?search=hello%20world&case_sensitive=true&bridge_gaps=false
- /requests?search=hello_there

## `photos`, `offset`, `most_recent`

if most_recent == "true", this retrieves a list of information about the most recent \$photos (\$photos is an integer) photos, offset by \\$offset (\$offset is also an integer). If most_recent != "true", this retrieves a list of the oldest \$photos photos, offset by \$offset.

- photos: Parameter is necessary, and value is consequential. This must be the number of photos that you want to receive information about, and if it is not an integer, it will be changed to the default number of photos (which is available to set in the settings of the app). Setting this to 0 will retrieve 0 photos, and the only way to retrieve all photos would be to set to \$photos to an absurdly large number, such as 999999999. 
- offset: Parameter is not necessary, and value is consequential. This must be the offset for the list of photos that you want to retrieve. For example, if you already retrieved the most recent 100 photos, but want to retrieve info about the next 100 images, you would set offset to 100, and photos to 100 as well. This must be an integer, or else it will default to 0. 
- most_recent: Parameter is not necessary, and value is consequential. This must be either "true" or "false". If it is neither, it will default to true. Setting this to false will query the oldest pictures first, and setting it to true or not settings it at all will retrieve the most recent images first.

Example queries:
- /requests?photos=100
- /requests?photos=40&offset=120&most_recent=false
- /requests?photos=1&most_recent=false

# `/data` requests

Requests to this URL return image data, which is why they have to be sent to a different url from /requests

## `path`

This simply contains the path, excluding the attachments base URL ('/private/var/mobile/Library/SMS/Attachments/') of the attachment that is requested. It should return all attachment types, and will be handled by the browser just like any other file of its type.

- path: Parameter is necessary, and value is consequential. Value needs to be a string containing the path of the file to get, minus the attachments base URL (mentioned above). It also filters out "../" to prevent LFI through this method, so any instances of '../' in the path will be filtered out.

Example queries:
- /data?path=00/D8/172BC809-BA7A-118D-18BCF0DEF/IMG_9841.JPEG

## `chat_id`

This contains the chat_id of the person that the request is trying to get the profile picture for. The chat_id should be in the same format as is specified in the `person` parameter above.

- chat_id: Parameter is necessary, and value is consequential. As stated above, it has a specified format that it should be in. 

Example queries:

- /data?chat_id=+15204458272

## `photo`

This will return an image from the image library, specifically from the `/var/mobile/Media/` folder. It it protected against LFI, just like `path` above. It will return whatever is at that address, whether it be a video or image.

- photo: Parameter is necessary, and value is consequential. It should be the raw path, excluding the prefix of `/var/mobile/Media/`, of the image that you want to retrieve.

Example queries:

- /data?photo=DCIM/109APPLE/IMG_8273.JPEG

# `/send` requests

Requests to this url are all sent using `POST`, as opposed to `GET`, as multipart/form-data forms (as opposed to application/x-www-form-urlencoded). In practice, it's generally safe to not encode anything in requests to this url, but only percent encodings (e.g. using `%20` for spaces and `%2B` for plus signs) will be accepted and parsed correctly. For example, replacing spaces with plus signs (as is specified in [RFC1738](https://www.ietf.org/rfc/rfc1738.txt) will cause the string to be used raw, and none of the plus signs will be replaced with spaces.

There are five key/value pairs that can be sent to this URL, and it accepts multiple files as well. For the text to actually send, you must include the chat, and then either at least 1 file, or something that is more than 0 characters for one of the other parameters.

As with all other requests (besides to the gatekeeper), you must authenticate before sending any requests to this url, or else nothing will happen.

## Arguments

## text

The value for this key simply contains the body of the text you want to send.

## subject

The value for this key contains the subject of the text that you want to send. For it to actually be included with the text, it must be at least 1 character long (not just ""); if it is 0-length or you simply don't include this key/value pair, the text will still be sent but it won't have a subject.

## chat

The value for this key contains the chat_identifier of the recipient, specified as in the `person` parameter above. Before 0.1.0+debug77, these could only be an address for an existing conversation, but with version 0.1.0+debug77 of SMServer (and 0.1.0-85+debug of libsmserver), you can post requests for new conversations; new conversations do not yet support attachments, though.

This parameter is necessary for every request, or else the app won't know who to send the text to.

## photos

The value for this key will contain a list of the path of the photos (from the camera roll) that you want to send with this text, but deliminted by colons and without the `/var/mobile/Media/` section of their path. For example, if you wanted to send three photos with this text, this parameter would look something like `DCIM/100APPLE/IMG_0001.JPG:DCIM/100APPLE/IMG_0002.JPG:DCIM/100APPLE/IMG_0003.JPG`.

## files

These need to be sent with the key 'attachments'. Other than that, just send them as normal. It does support sending multiple attachments, but (obviously), the more attachments you send, the longer it'll take, and the higher likelihood it'll fail along the way.

## Example requests

### Python3

Sending a text with a subject and no attachments:
```python
from requests import post

# It's safest to explicitly encode spaces as `%20`, since python replaces all spaces with plus signs, 
# which are not filtered out. If your scripting language does not replace spaces with plus signs,
# you need not manually encode them.
vals = {'text': 'Hello%20world!', 'subject': 'This%20is%20a%20test', 'chat': 'email@email.org'}
url = 'https://192.168.0.127:8741/send'

# The server's certificate is self-signed, so make to include the `verify` parameter in the request
post(url, data=vals, verify=False)
```

Sending an attachment with no text:
```python
from requests import post

vals = {'chat': '+11231231234'}

# file is a tuple, with the first val being the file name, the second being an open operator on the file, and the third being the mimetype.
file = ('image.jpeg', open('/home/user/Pictures/image.jpeg', 'rb'), 'image/jpeg')
files_values = {'attachments': file}
url = 'https://192.168.0.127:8741/send'

# The server's certificate is self-signed, so make to include the `verify` parameter in the request
post(url, files=files_values, data=vals, verify=False)
```
I've read that the value for `attachments` in `files_values` could be a list of tuples (a list of variables like `file` in the example above), but doing that has caused python to fail to post the request every time I've tried it, so I would recommend just iterating over each attachment and sending them individually.

Sending a text with a subject and a photo from the camera roll:
```python
from requests import post

# Set the values
vals = {'chat': '+11231231234', 'text': 'This%20is%20the%20body!', 
	'subject': 'This%20is%20the%20subject!', 'photos': 'DCIM/100APPLE/IMG_0001.JPG'}
url = 'https://192.168.0.127:8741/send'

# Make the request
post(url, data=vals, verify=False)
```

### Curl
Sending a text with a body, subject, and attachments with curl
```bash
curl -k -F "attachments=@/home/user/Pictures/image1.png" \
        -F "attachments=@/home/user/Pictures/image2.png" \
        -F "text=Hello there" \
        -F "subject=Subject" \
        -F "chat=+11231231234" \
        "https://192.168.0.127:8741/send"
```
