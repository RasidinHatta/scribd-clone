"use server"

import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email: string, token: string) => {
    const domain = process.env.BASED_URL
    const confirmationLink = `${domain}/verify-email?token=${token}`

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: `${email}`,
            subject: `Verify your email`,
            html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`
        });
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to send email.' };
    }
}