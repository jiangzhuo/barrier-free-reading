import { defineConfig } from 'wxt';
import path from "node:path";

// See https://wxt.dev/api/config.html
export default defineConfig({
    runner:{
        startUrls: [
            'https://read.amazon.co.jp/?asin=B0CW1HLHSP&ref_=kwl_kr_iv_rec_1'
        ],
        // disabled: true
        // chromiumProfile: '/home/jiangzhuo/.config/google-chrome/Default',
        chromiumArgs: [
            '--auto-open-devtools-for-tabs',
            `--user-data-dir=${path.join(__dirname, '.browser-profiles/chrome')}`,
            '--hide-crash-restore-bubble'
        ],
        binaries:{
            chrome: '/opt/google/chrome/chrome',
        }
    },
    manifest: {
        permissions: [
            'sidePanel',
            "tabs",
            "scripting"
        ]
    }
});
