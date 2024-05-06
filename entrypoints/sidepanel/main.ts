import {onMessage} from "webext-bridge/side-panel";

console.log("Hello from side panel");
onMessage("ping", ({data}) => {
    console.log("Received ping from", data);
    return "pong-side-panel";
});