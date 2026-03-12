
## How to Fix the "Unable to acquire lock" Error

The "Unable to acquire lock" error means that another Next.js development server is already running. To fix this, you need to find and terminate the other process.

### Instructions:

1.  **Find the process ID (PID):** Open your terminal and run the following command to find the process ID of the process running on port 3001:

    ```bash
    lsof -i :3001
    ```

    This command will list all the processes that are using port 3001. Look for the process with the name `node` or `next-dev` and note its PID.

2.  **Kill the process:** Once you have the PID, run the following command to terminate the process:

    ```bash
    kill -9 <PID>
    ```

    Replace `<PID>` with the actual process ID you found in the previous step.

3.  **Start the development server again:** After terminating the other process, you can start the development server again by running the command `npm run dev`.

This should resolve the "Unable to acquire lock" error and start the development server successfully.
