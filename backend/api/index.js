async function handler(event, context) {
    console.log("Function invoked");

    if (!isConnected) {
        console.log("Connecting DB...");

        try {
            await connectDB();
            isConnected = true;
            console.log("DB connected");
        } catch (err) {
            console.error(err);
        }
    }

    console.log("Returning serverless app");
    return serverless(app)(event, context);
}