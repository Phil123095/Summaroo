import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class Mail:

    def __init__(self):
        self.port = 465
        self.smtp_server_domain_name = "smtp.gmail.com"
        self.sender_mail = "hello.summaroo@gmail.com"
        self.password = "vbarhfutcrmnkcsn"

    def send(self, emails):
        ssl_context = ssl.create_default_context()
        service = smtplib.SMTP_SSL(self.smtp_server_domain_name, self.port, context=ssl_context)
        service.login(self.sender_mail, self.password)

        msg = MIMEMultipart('alternative')
        html = open("email_template.html")
        part2 = MIMEText(html.read(), 'html')

        msg['Subject'] = "Thanks for signing up!"
        msg['From'] = "Hello from Summaroo <self.sender_mail>"  # Your from name and email address
        msg['To'] = emails[0]

        msg.attach(part2)

        for email in emails:
            result = service.sendmail(self.sender_mail, msg['To'], msg.as_string())

        service.quit()

    def send_contact_form(self, first_name, last_name, contact_email, full_message):
        email_template =  f"""
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
                <p>Auto Phil</p>
              </body>
            </html>
            """

        ssl_context = ssl.create_default_context()
        service = smtplib.SMTP_SSL(self.smtp_server_domain_name, self.port, context=ssl_context)
        service.login(self.sender_mail, self.password)

        msg = MIMEMultipart('alternative')
        email_template_read = open(email_template)
        part2 = MIMEText(email_template_read.read(), 'html')

        msg['Subject'] = "New Contact Form Submission"
        msg['From'] = "Summaroo Support <self.sender_mail>"  # Your from name and email address
        msg['To'] = 'philippehenderson95@gmail.com'

        msg.attach(part2)

        result = service.sendmail(self.sender_mail, msg['To'], msg.as_string())

        service.quit()