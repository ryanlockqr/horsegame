import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { generateClient } from "aws-amplify/api";

Amplify.configure(outputs);
const client = generateClient({
    authMode: "userPool",
})
