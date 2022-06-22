import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class Mail:

    def __init__(self):
        self.port = 465
        self.smtp_server_domain_name = "smtp.gmail.com"
        self.sender_mail = "hello.summaroo@gmail.com"
        self.password = "bxhyjhzytqxfvlec"

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