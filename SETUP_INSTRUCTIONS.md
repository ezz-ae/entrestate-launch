
## Setup Instructions to Enable Authentication

To enable authentication with PayPal, you need to create a `.env` file in the root of the project and add the following environment variables:

```
PAYPAL_CLIENT_ID="YOUR_PAYPAL_CLIENT_ID"
PAYPAL_CLIENT_SECRET="YOUR_PAYPAL_CLIENT_SECRET"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
DATABASE_URL="YOUR_DATABASE_URL"
```

**Instructions:**

1.  **Create the `.env` file:** In the root of the project, create a new file named `.env`.
2.  **Add the environment variables:** Copy the content above and paste it into the `.env` file.
3.  **Replace the placeholder values:**
    *   Replace `"YOUR_PAYPAL_CLIENT_ID"` with your actual PayPal client ID.
    *   Replace `"YOUR_PAYPAL_CLIENT_SECRET"` with your actual PayPal client secret.
    *   Replace `"YOUR_NEXTAUTH_SECRET"` with a secret key for `next-auth`. You can generate a secret key using the command `openssl rand -base64 32`.
    *   Replace `"YOUR_DATABASE_URL"` with the connection string for your PostgreSQL database.
4.  **Restart the development server:** After creating the `.env` file and adding the environment variables, you need to restart the development server for the changes to take effect.
5.  **Run `npx prisma db push`:** Make sure your PostgreSQL server is running and then run the command `npx prisma db push` to apply the database schema changes.

6.  **Seed the PayPal account:** Run the command `npm run seed:paypal` to create the "Pro Plan" product and plan in your PayPal account. You should see a confirmation message in the console with the product and plan details.

Once you have completed these steps, you will be able to use the PayPal authentication and the "Pro Plan" will be available for subscription.
