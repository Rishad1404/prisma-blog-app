import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp:true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email/token=${token}`;
        try{
                  const info = await transporter.sendMail({
        from: '"Prisma Blog" <prismablog@ph.com>',
        to: user.email,
        subject: "Hello ✔",
        text: "Hello world?", // Plain-text version of the message
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      margin: 25px 0;
      padding: 14px 28px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      background-color: #f4f6f8;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .link {
      word-break: break-all;
      color: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Verify Your Email</h2>
    </div>
    <div class="content">
      <p>Hello ${user.name}</p>

      <p>
        Thank you for registering with <strong>Prisma Blog</strong>.
        Please confirm your email address by clicking the button below.
      </p>

      <p style="text-align: center;">
        <a href="${verificationUrl}" class="button">
          Verify Email
        </a>
      </p>

      <p>
        If the button doesn’t work, copy and paste this link into your browser:
      </p>

      <p class="link">
        ${verificationUrl}
      </p>

      <p>
        This link will expire soon for security reasons.
        If you didn’t create an account, you can safely ignore this email.
      </p>

      <p>
        Regards,<br/>
        <strong>Prisma Blog Team</strong>
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
    </div>
  </div>
</body>
</html>
`,
      });
      console.log("Message sent:", info.messageId);
        }

    catch(err){
        console.error(err);
        throw err
    }
      
    }
  },

  socialProviders: {
        google: { 
            prompt:"select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        
        }, 
    },
  
});
