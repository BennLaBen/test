#!/bin/bash
# Setup Vercel environment variables for LLEDO Aerotools

# NOTE: Run this manually - replace DATABASE_URL with your Railway PostgreSQL URL

echo "postgresql://lledo:lledo_secret_2024@localhost:5433/lledo_db" | npx vercel env add DATABASE_URL production --force --sensitive
echo "aeba40a03dd4daaa8558217d57bd7a4b7b8f2e84b8af3be7a5d0d91f32224ecdcecc06fa4c302a654ee0eac2f273881ef3ef87a0bb44273532e316329c5d4591" | npx vercel env add AUTH_SECRET production --force --sensitive
echo "aeba40a03dd4daaa8558217d57bd7a4b7b8f2e84b8af3be7a5d0d91f32224ecdcecc06fa4c302a654ee0eac2f273881ef3ef87a0bb44273532e316329c5d4591" | npx vercel env add NEXTAUTH_SECRET production --force --sensitive
echo "https://lledo-aerotools.vercel.app" | npx vercel env add NEXTAUTH_URL production --force
echo "webmaster@mpeb13.com" | npx vercel env add ADMIN_EMAIL production --force
echo "AAS+DE\$x3Zgf" | npx vercel env add ADMIN_PASSWORD production --force --sensitive
echo "re_53BCgvfw_D9r7L4TFsQxM1T4QKD13AnSZ" | npx vercel env add RESEND_API_KEY production --force --sensitive
echo "webmaster@mpeb13.com" | npx vercel env add SMTP_FROM production --force
echo "LLEDO Aerotools" | npx vercel env add SMTP_FROM_NAME production --force
echo "contact@mpeb13.com" | npx vercel env add CONTACT_EMAIL production --force
echo "https://lledo-aerotools.vercel.app" | npx vercel env add NEXT_PUBLIC_SITE_URL production --force
echo "production" | npx vercel env add NODE_ENV production --force
echo "aeba40a03dd4daaa8558217d57bd7a4b7b8f2e84b8af3be7a5d0d91f32224ecdcecc06fa4c302a654ee0eac2f273881ef3ef87a0bb44273532e316329c5d4591" | npx vercel env add JWT_SECRET production --force --sensitive
echo "97917710ed9817e406edb40f7db6a2a6" | npx vercel env add ENCRYPTION_KEY production --force --sensitive

echo "Done! All env variables added."
