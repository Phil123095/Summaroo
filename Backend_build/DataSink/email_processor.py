# import built-in modules
import base64
import os

# import parsing modules
import httplib2

# import gmail modules
from googleapiclient import errors, discovery
from oauth2client import client, tools, file

# import email modules
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

'''
FUNCTIONS FOR CREATING AND SEND EMAIL MESSAGE
'''

SCOPES = 'https://www.googleapis.com/auth/gmail.send'
CLIENT_SECRET_FILE = 'client_secret.json'

class Mail:

    def __init__(self):
        self.CLIENT_SECRET_FILE = 'client_secret.json'
        self.port = 465
        self.smtp_server_domain_name = "smtp.gmail.com"
        self.sender_mail = "hello.summaroo@gmail.com"
        self.password = "vbarhfutcrmnkcsn"

    def get_credentials_lambda(self):
        client_id = os.environ['GMAIL_CLIENT_ID']
        client_secret = os.environ['GMAIL_CLIENT_SECRET']
        refresh_token = os.environ['GMAIL_REFRESH_TOKEN']
        credentials = client.GoogleCredentials(None,
                                               client_id,
                                               client_secret,
                                               refresh_token,
                                               None,
                                               "https://accounts.google.com/o/oauth2/token",
                                               'my-user-agent')

        return credentials

    def get_credentials(self):
        wd = os.getcwd()

        # creates credentials with a refresh token
        credential_path = os.path.join(wd, 'credentials.json')
        store = file.Storage(credential_path)
        creds = store.get()
        if not creds or creds.invalid:
            flow = client.flow_from_clientsecrets('client_secret.json', SCOPES)
            creds = tools.run_flow(flow, store)
        return creds

    def send_signup(self, email):
        credentials = self.get_credentials_lambda()
        http = credentials.authorize(httplib2.Http())
        service = discovery.build('gmail', 'v1', http=http)

        msg = MIMEMultipart('alternative')
        html = open("email_template.html")

        part2 = MIMEText(html.read(), 'html')

        msg['Subject'] = "Thanks for signing up!"
        msg['From'] = "Hello from Summaroo <self.sender_mail>"  # Your from name and email address
        msg['To'] = email

        msg.attach(part2)

        message = {'raw': base64.urlsafe_b64encode(msg.as_string().encode('UTF-8')).decode('ascii')}

        try:
            message = (service.users().messages().send(userId="me", body=message).execute())
            print('Message Id: %s' % message['id'])
            return message
        except errors.HttpError as error:
            print('An error occurred: %s' % error)
            return "Error"

    def send_contact_form(self, first_name, last_name, contact_email, full_message):
        email_template = f"""
                    <html>
                      <head></head>
                      <body>
                        <p>Hi!<br>
                           We've received a new message from the Summaroo Contact Form. Here are the details<br>
                        </p>
                        <p>Full Name: {first_name + ' ' + last_name}</p>
                        <p>Contact Email: {contact_email}</p>
                        <p>Full Message: {full_message}</p>
                        <p>Please have a look, and maybe follow up.</p>
                        <p>Best,</p>
                        <p>- Auto Phil</p>
                      </body>
                    </html>
                    """

        credentials = self.get_credentials_lambda()
        http = credentials.authorize(httplib2.Http())
        service = discovery.build('gmail', 'v1', http=http)

        msg = MIMEMultipart('alternative')

        part2 = MIMEText(email_template, 'html')

        msg['Subject'] = "New Contact Form Submission"
        msg['From'] = "Summaroo Support <self.sender_mail>"  # Your from name and email address
        msg['To'] = """philippe.henderson@student.ie.edu, williams.br@student.ie.edu, 
                    alexander.schwab@student.ie.edu, nora.tombers@student.ie.edu,
                    rainer.schaeffter@student.ie.edu, nicolo.prini@student.ie.edu
                    """

        msg.attach(part2)

        message = {'raw': base64.urlsafe_b64encode(msg.as_string().encode('UTF-8')).decode('ascii')}

        try:
            message = (service.users().messages().send(userId="me", body=message).execute())
            print('Message Id: %s' % message['id'])
            return message
        except errors.HttpError as error:
            print('An error occurred: %s' % error)
            return "Error"
