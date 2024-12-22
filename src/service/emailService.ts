
import nodemailer from 'nodemailer';
import path from 'path';
import { lookupLocation } from '../utils/geoService';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (
    req: any,
    email: string,
    type: 'login' | 'creation' | 'disable' | 'enable'| 'reset' |'change', 
    details: { userAgent?: string; location?: string, reason?:string, token?:string, previousRole?: string, newRole?: string}): Promise<void> => {
    const resetLink = details.token ? `http://reset-password?token=${details.token}` : '';
    
    const userAgent = req.headers["user-agent"] || "Unknown Devices";
    const ip = req.ip || req.connection.remoteAddress;
    const location = lookupLocation(ip)
    const currentYear = new Date().getFullYear();
    let subject ='';
    let emailTempalates = '';
    
    switch (type) {
        case 'login':
            subject = 'New login detected'
            emailTempalates = `
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
                 <p style="color: #555;">Dear ${email},</p>
                 <p>We detected a login to your account from a new device or location:</p>
                 <ul style="padding-left: 20px; color: #555;">
                     <li><b> Devices:</b> ${userAgent}</li>
                     <li><b> Location:</b> ${location}</li>                     
                     <li><b>Time:</b> ${new Date().toLocaleString()}</li>
                 </ul>
                 <p>If this wasn't you, please reset your password immediately by <a href="https://yourdomain.com/reset-password" style="color: #007BFF; text-decoration: none;">clicking here</a>.</p>
             </div>
             <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                 <p>&copy; ${currentYear} Kickside Rwanda</p>
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
            
            `
            
            break;
            case 'creation':
                subject = 'Welcome to kickside Rwanda'
                emailTempalates = `
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
                    <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
                    <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
                    <h1 style="margin: 0;">Kickside Rwanda</h1>
                    </div>
                    <div style="padding: 20px;">
                    <h2 style="color: #333;">Welcome to Kickside Rwanda!</h2>
                    <p style="color: #555;">Dear ${email},</p>
                    <p>Your Kickside Rwanda account has been successfully created!</p>
                    <p>To ensure the security of your account, we highly recommend changing your default password. It's a simple process:</p>
                    <ol style="padding-left: 20px; color: #555;">
                        <li>Click on this link to access the password reset page: <a href="https://yourdomain.com/reset-password" style="color: #007BFF; text-decoration: none;">Reset Password</a></li>
                        <li>Enter your new password and confirm it.</li>
                        <li>Click "Change Password" to complete the process.</li>
                    </ol>
                    <p>With a strong password, you can enjoy all the features of Kickside Rwanda with peace of mind.</p>
                    </div>
                    <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                    <p>&copy; ${currentYear} Kickside Rwanda</p>
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
                break;

            case 'disable':
                subject = 'Account Disabled';
                emailTempalates = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>User Account disabled</title>
                </head>

                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                    <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
                    <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
                    <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
                    <h1 style="margin: 0;">Kickside Rwanda</h1>
                    </div>
                    <div style="padding: 20px;">
                    <h2 style="color: #333;">Important Notice Regarding Your Kickside Rwanda Account</h2>
                    <p style="color: #555;">Dear ${email},</p>
                    <p>We regret to inform you that your Kickside Rwanda account has been disabled.</p>
                    <p><strong>Reason for Disabling:</strong>${details.reason}</p>
                    <p>If you have any questions or concerns regarding the disabling of your account, please contact our support team at [Support Email] or [Support Phone Number].</p>
                    <p>Sincerely,</p>
                    <p>[Your Company Name]</p>
                    </div>
                    <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                    <p>&copy; ${currentYear} Kickside Rwanda</p>
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
                case 'enable':
                    subject = 'Account Active';
                    emailTempalates = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>User Account disabled</title>
                    </head>
    
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                        <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
                        <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
                        <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
                        <h1 style="margin: 0;">Kickside Rwanda</h1>
                        </div>
                        <div style="padding: 20px;">
                        <h2 style="color: #333;">Important Notice Regarding Your Kickside Rwanda Account</h2>
                        <p style="color: #555;">Dear ${email},</p>
                        <p>We inform you that your Kickside Rwanda account has been Enabled.</p>
                        <p>Sincerely,</p>
                        <p>Kickside Rwanda</p>
                        </div>
                        <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                        <p>&copy; ${currentYear} Kickside Rwanda</p>
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
                    break;
                    case 'reset':
                        subject = 'Password Reset';
                        emailTempalates = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Password reset</title>
                        </head>
        
                        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                            <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
                            <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
                            <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
                            <h1 style="margin: 0;">Kickside Rwanda</h1>
                            </div>
                            <div style="padding: 20px;">
                            <h2 style="color: #333;">Account Password Reset</h2>
                            <p style="color: #555;">Dear ${email},</p>
                            <p>You requested a password reset. Click the link below to reset your password:</p>
                            <a href="${details.token}">Reset Password</a>
                            <p>If you did not request this, please ignore this email.</p>
                            <p>Sincerely,</p>
                            <p>Kickside Rwanda</p>
                            </div>
                            <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                            <p>&copy; ${currentYear} Kickside Rwanda</p>
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
                        break;
                        case 'change':
                            subject = "Role Changed";
                            emailTempalates = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>User Account disabled</title>
                    </head>
    
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                        <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
                        <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
                        <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
                        <h1 style="margin: 0;">Kickside Rwanda</h1>
                        </div>
                        <div style="padding: 20px;">
                        <h2 style="color: #333;">Important Notice Regarding Your Kickside Rwanda Account</h2>
                        <p style="color: #555;">Dear ${email},</p>
                         <p>
                            We would like to inform you that your role has been updated.<br>
                            <strong>Previous Role:<strong> ${details.previousRole}</strong><br>
                            <strong>New Role:<strong> ${details.newRole} </strong>
                        </p>
                        <p>Sincerely,</p>
                        <p>Kickside Rwanda</p>
                        </div>
                        <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
                        <p>&copy; ${currentYear} Kickside Rwanda</p>
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
        default:
            break;
    }
//     <!DOCTYPE html>
//     <html>
//     <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
//         <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
//             <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
//                 <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
//                 <h1 style="margin: 0;">Kickside Rwanda</h1>
//             </div>
//             <div style="padding: 20px;">
//                 <h2 style="color: #333;">New Login Detected!</h2>
//                 <p style="color: #555;">Dear User,</p>
//                 <p>We detected a login to your account from a new device or location:</p>
//                 <ul style="padding-left: 20px; color: #555;">
//                     <li><b>Device:</b> ${device}</li>
//                     <li><b>Location:</b> ${location}</li>
//                     <li><b>Time:</b> ${new Date().toLocaleString()}</li>
//                 </ul>
//                 <p>If this wasn't you, please reset your password immediately by <a href="https://yourdomain.com/reset-password" style="color: #007BFF; text-decoration: none;">clicking here</a>.</p>
//             </div>
//             <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
//                 <p>&copy; ${currentYear} Kickside Rwanda</p>
//                 <div>
//                     <a href="https://facebook.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Facebook</a>
//                     <a href="https://twitter.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Twitter</a>
//                     <a href="https://instagram.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Instagram</a>
//                 </div>
//                 <p>This is an automated message. Please do not reply.</p>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;

//     const userCreation =`
//     <!DOCTYPE html>
//     <html>
//     <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
//     <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
//         <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
//         <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
//         <h1 style="margin: 0;">Kickside Rwanda</h1>
//         </div>
//         <div style="padding: 20px;">
//         <h2 style="color: #333;">Welcome to Kickside Rwanda!</h2>
//         <p style="color: #555;">Dear [username],</p>
//         <p>Your Kickside Rwanda account has been successfully created!</p>
//         <p>To ensure the security of your account, we highly recommend changing your default password. It's a simple process:</p>
//         <ol style="padding-left: 20px; color: #555;">
//             <li>Click on this link to access the password reset page: <a href="https://yourdomain.com/reset-password" style="color: #007BFF; text-decoration: none;">Reset Password</a></li>
//             <li>Enter your new password and confirm it.</li>
//             <li>Click "Change Password" to complete the process.</li>
//         </ol>
//         <p>With a strong password, you can enjoy all the features of Kickside Rwanda with peace of mind.</p>
//         </div>
//         <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
//         <p>&copy; ${currentYear} Kickside Rwanda</p>
//         <div>
//             <a href="https://facebook.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Facebook</a>
//             <a href="https://twitter.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Twitter</a>
//             <a href="https://instagram.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Instagram</a>
//         </div>
//         <p>This is an automated message. Please do not reply.</p>
//         </div>
//     </div>
//     </body>
//     </html>

//     `;
    
//     const userDisabledEmail = `
//     <!DOCTYPE html>
// <html>
// <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
// <div style="width: 100%; max-width: 600px; margin: auto; background: #ffffff; border-radius: 5px; overflow: hidden;">
//   <div style="background: #abcff5; color: #ffffff; padding: 20px; text-align: center;">
//     <img src="cid:logo" alt="Company Logo" style="max-width: 50px; height: 50px;">
//     <h1 style="margin: 0;">Kickside Rwanda</h1>
//   </div>
//   <div style="padding: 20px;">
//     <h2 style="color: #333;">Important Notice Regarding Your Kickside Rwanda Account</h2>
//     <p style="color: #555;">Dear ${email},</p>
//     <p>We regret to inform you that your Kickside Rwanda account has been disabled.</p>
//     <p><strong>Reason for Disabling:</strong>[reason behind disabled]</p>
//     <p>If you have any questions or concerns regarding the disabling of your account, please contact our support team at [Support Email] or [Support Phone Number].</p>
//     <p>Sincerely,</p>
//     <p>[Your Company Name]</p>
//   </div>
//   <div style="background: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #777;">
//     <p>&copy; ${currentYear} Kickside Rwanda</p>
//     <div>
//       <a href="https://facebook.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Facebook</a>
//       <a href="https://twitter.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Twitter</a>
//       <a href="https://instagram.com/kickside_rw" style="margin: 0 10px; text-decoration: none; color: #007BFF;">Instagram</a>
//     </div>
//     <p>This is an automated message. Please do not reply.</p>
//   </div>
// </div>
// </body>
// </html>
//     `;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject,
        html: emailTempalates,
        attachments: [
            {
                filename: 'logo.png',
                path: path.join(__dirname, 'logo.png'), 
                cid: 'logo',
            },
        ],
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email Sent Successfully:', info.response);
        
    } catch (error) {
        console.error('Error Sending Email:', error)
        
    }

};

