import {onMessage} from "../../../webext-bridge/src/background";

export default defineBackground(() => {
    console.log('Hello background 2222!', {id: browser.runtime.id});

    onMessage('ping', (data) => {
        console.log('Received ping from', data);
        return 'pong';

    });

});
