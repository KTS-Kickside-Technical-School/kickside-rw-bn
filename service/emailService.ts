import nodemailer from 'nodemailer';
import path from 'path';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
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
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
            <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
                <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
                <h1 style="margin: 0;">Kickside Rwanda</h1>
            </div>
            <div style="padding: 20px;">
                <h2 style="color: #333;">New Login Detected!</h2>
                <p style="color: #555;">Dear User,</p>
                <p>We detected a login to your account from a new device or location:</p>
                <ul style="padding-left: 20px; color: #555;">
                    <li><b>Device:</b> ${device}</li>
                    <li><b>Location:</b> ${location}</li>
                    <li><b>Time:</b> ${new Date().toLocaleString()}</li>
                </ul>
                <p>If this wasn't you, please reset your password immediately by <a href="https://yourdomain.com/reset-password" style="color: #007BFF; text-decoration: none;">clicking here</a>.</p>
            </div>
            <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                <p>&copy; 2023 Kickside Rwanda</p>
                <div>
                    <a href="https://facebook.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Facebook</a>
                    <a href="https://twitter.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Twitter</a>
                    <a href="https://instagram.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Instagram</a>
                </div>
                <p>This is an automated message. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'akarabosonia250@gmail.com',
        subject: 'New Login Notification',
        html: emailTemplate,
        attachments: [
            {
                filename: 'logo.png',
                path: path.join(__dirname, 'logo.png'), // Path to the image
                cid: 'logo', // Content-ID to reference in the email
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};
