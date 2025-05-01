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
      html: `
            <body style="font-family: Arial, sans-serif; background-color: #E5E5E5; margin: 0; padding: 0;">
              <table width="100%" bgcolor="#F6FAFB" align="center" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <table width="600" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding:48px 0 30px 0; text-align: center; font-size: 14px; color: #1a73e8;">
                          SAMS - Study Archive Management System
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 48px 30px 40px; background-color: #ffffff; color: #000000;">
                          <table width="100%">
                            <tr>
                              <td style="font-size: 18px; font-weight: bold; padding-bottom: 24px;">
                                Your 2FA Code
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; padding-bottom: 10px;">
                                We received a request to authenticate your login using Two-Factor Authentication (2FA) for your SAMS account.
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; padding-bottom: 16px;">
                                Please use the following code to complete your authentication:
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 20px; font-weight: bold; text-align: center; padding: 16px; background-color: #f2f2f2; border-radius: 6px; cursor: pointer;"
                                  onclick="navigator.clipboard.writeText(this.innerText); alert('2FA code copied to clipboard!');">
                                ${token}
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; padding-top: 16px;">
                                If you didn’t request this code, you can safely ignore this message.
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 16px;">
                                <hr style="border: none; border-bottom: 1px solid #8B949F; width: 117px;" />
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px;">
                                Need help? Contact us at <a href="mailto:${process.env.GMAIL_USERNAME}">${process.env.GMAIL_USERNAME}</a><br />
                                &copy; ${new Date().getFullYear()} SAMS. All rights reserved.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 24px 0 48px; text-align: center; font-size: 11px; color: #8B949F;">
                          SAMS by Rasidin Hatta, Universiti Teknologi Malaysia<br />
                          Johor, Malaysia
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            `
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
            <body style="font-family: Arial, sans-serif; background-color: #E5E5E5; margin: 0; padding: 0;">
              <table width="100%" bgcolor="#F6FAFB" align="center" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center">
                    <table width="600" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding:48px 0 30px 0; text-align: center; font-size: 14px; color: #1a73e8;">
                          SAMS - Study Archive Management System
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 48px 30px 40px; background-color: #ffffff; color: #000000;">
                          <table width="100%">
                            <tr>
                              <td style="font-size: 18px; font-weight: bold; padding-bottom: 24px;">
                                Welcome to SAMS!
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; padding-bottom: 10px;">
                                Thank you for signing up for <strong>SAMS (Study Archive Management System)</strong>.
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; padding-bottom: 16px;">
                                To get started, please verify your email address by clicking the button below:
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 24px;">
                                <a href="${confirmationLink}" style="display: inline-block; width: 100%; background: #1a73e8; color: #fff; text-align: center; padding: 12px 0; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 6px;">
                                  Verify Email
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px; padding-bottom: 10px;">
                                If you didn’t create an account with SAMS, you can safely ignore this message.
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 16px;">
                                <hr style="border: none; border-bottom: 1px solid #8B949F; width: 117px;" />
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 14px;">
                                Need help? Contact us at <a href="mailto:${process.env.GMAIL_USERNAME}">${process.env.GMAIL_USERNAME}</a><br />
                                &copy; ${new Date().getFullYear()} SAMS. All rights reserved.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 24px 0 48px; text-align: center; font-size: 11px; color: #8B949F;">
                          SAMS by Rasidin Hatta, Universiti Teknologi Malaysia<br />
                          Johor, Malaysia
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
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
              <body style="font-family: 'Open Sans', sans-serif; background: #E5E5E5; margin: 0; padding: 0;">
                <table width="100%" bgcolor="#F6FAFB" align="center" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center">
                      <table width="600" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="padding:48px 0 30px 0; text-align: center; font-size: 14px; color: #1a73e8;">
                            SAMS - Study Archive Management System
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 48px 30px 40px; background: #ffffff; color: #000000;">
                            <table width="100%">
                              <tr>
                                <td style="font-size: 18px; font-weight: bold; padding-bottom: 24px;">
                                  Hello! Forgot your password?
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size: 14px; padding-bottom: 10px;">
                                  We received a password reset request for your account: <span style="color: #1a73e8;">${email}</span>.
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size: 14px; font-weight: 700; padding-bottom: 16px;">
                                  Click the button below to proceed.
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 24px;">
                                  <a href="${resetPasswordLink}" style="display: inline-block; width: 100%; background: #1a73e8; color: #fff; text-align: center; padding: 12px 0; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 6px;">
                                    Reset Password
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size: 14px; padding-bottom: 10px;">
                                  The password reset link is valid for the next 24 hours.
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size: 14px; padding-bottom: 60px;">
                                  If you didn’t request this, please ignore this message or contact our support at <a href="mailto:${process.env.GMAIL_USERNAME}">${process.env.GMAIL_USERNAME}</a>.
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 16px;">
                                  <hr style="border: none; border-bottom: 1px solid #8B949F; width: 117px;" />
                                </td>
                              </tr>
                              <tr>
                                <td style="font-size: 14px;">
                                  Best regards,<br />
                                  <strong>SAMS Team</strong>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 24px 0 48px; text-align: center; font-size: 11px; color: #8B949F;">
                            SAMS by Rasidin Hatta, Universiti Teknologi Malaysia<br />
                            Johor, Malaysia
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            `
    });
    return { success: true, message: 'Email sent successfully!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to send email.' };
  }
}