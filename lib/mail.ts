"use server"

import nodemailer from 'nodemailer'

const domain = process.env.BASED_URL

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});


export const sendTwoFactorEmail = async (email: string, token: string) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: `${email}`,
      subject: `Your Two Factor Authentication Token | SAMS`,
      html: `<p>Your 2FA code: ${token}</P>`
    })
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to send email.' };
  }
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/verify-email?token=${token}`
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: `${email}`,
      subject: `Verify Your Email | SAMS`,
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #1a73e8;">Welcome to SAMS!</h2>
                <p style="font-size: 16px; color: #333;">
                  Thank you for signing up for <strong>SAMS (Study Archive Management System)</strong>.
                </p>
                <p style="font-size: 16px; color: #333;">
                  To get started, please verify your email address by clicking the button below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmationLink}" style="background-color: #1a73e8; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    Verify Email
                  </a>
                </div>
                <p style="font-size: 14px; color: #555;">
                  If you didn’t create an account with SAMS, you can safely ignore this message.
                </p>
                <hr style="margin: 30px 0;" />
                <p style="font-size: 12px; color: #999;">
                  Need help? Contact us at <a href="mailto:${process.env.GMAIL_USERNAME}">${process.env.GMAIL_USERNAME}</a><br/>
                  &copy; ${new Date().getFullYear()} SAMS. All rights reserved.
                </p>
              </div>
            `
    });
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to send email.' };
  }
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetPasswordLink = `${domain}/reset-password?token=${token}`
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USERNAME,
      to: `${email}`,
      subject: `Reset Your Password | SAMS`,
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                <h2 style="color: #1a73e8;">SAMS - Study Archive Management System</h2>
                <p style="font-size: 16px; color: #333;">
                  We received a request to reset your password. If you made this request, click the button below to continue:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetPasswordLink}" style="background-color: #1a73e8; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    Reset Password
                  </a>
                </div>
                <p style="font-size: 14px; color: #555;">
                  If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                </p>
                <hr style="margin: 30px 0;" />
                <p style="font-size: 12px; color: #999;">
                  This email was sent by the SAMS system. If you have any issues, please contact support at <a href="mailto:${process.env.GMAIL_USERNAME}">${process.env.GMAIL_USERNAME}</a>.
                </p>
              </div>
            `
    });
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to send email.' };
  }
}