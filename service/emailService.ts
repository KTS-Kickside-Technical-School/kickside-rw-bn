import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,   // Replace with your Server
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendLoginNotification = async (email: string, device: string, location: string): Promise<void> => {
    const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <body>
        <h1>New Login Detected</h1>
        <p>Hello,</p>
        <p>We detected a login to your account from a new device or location:</p>
        <ul>
            <li><b>Device:</b> ${device}</li>
            <li><b>Location:</b> ${location}</li>
            <li><b>Time:</b> ${new Date().toLocaleString()}</li>
        </ul>
        <p>If this wasn't you, please reset your password immediately <a href="https://">Click Here to reset your password</a>.</p>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: "niyonkurua97@gmail.com",
        subject: 'New Login Notification',
        html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
};
