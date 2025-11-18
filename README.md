# bridge-system

## Account Verification & Cleanup

This system implements automatic cleanup of unverified accounts to maintain database integrity:

### Configuration

**Environment Variable:** `UNVERIFIED_ACCOUNT_DELETION_DAYS`
- **Default:** 3 days
- **Description:** Number of days before unverified accounts are automatically deleted
- Set this in your environment variables or `.env` file

### How it Works

1. **Registration Flow:**
   - User creates an account → Redirected immediately to email verification
   - OTP code sent via email (valid for 10 minutes)
   - User must verify within the configured days (default: 3 days)

2. **Automatic Reminders:**
   - **For 3-day deletion:** Reminders sent on Day 1 and Day 2
   - **For 7+ day deletion:** Reminders sent on Day 3 and Day 6
   - Final reminder sent 24 hours before deletion

3. **Safety Net:**
   - If user closes verification page, they can still verify on next login
   - System checks verification status on every login attempt
   - Unverified users are redirected to email confirmation page

4. **Automatic Cleanup:**
   - Background service runs every 24 hours
   - Deletes unverified accounts older than configured days
   - Also deletes associated resident data to keep database clean

### Setup

1. **Server Setup:**
   - Copy `server/.env.example` to `server/.env`
   - Configure `UNVERIFIED_ACCOUNT_DELETION_DAYS` (optional, defaults to 3)
   - Ensure MongoDB, JWT, and email service (Resend) are configured

2. **Client Setup:**
   - Copy `client/.env.example` to `client/.env`
   - Configure `VITE_API_URL` to point to your server API