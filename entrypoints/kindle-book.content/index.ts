import { sendMessage, onMessage } from "webext-bridge/content-script";
export default defineContentScript({
    matches: ['*://read.amazon.co.jp/*'],
    runAt: 'document_end',
    main(){
        console.log('Hello content 111.');

        let currentIndex = 0;
        const cache = new Map()
        // const ocr = makeOcr()

        const getCurrentIndex = function () {
            cache.clear()
            return currentIndex = 0;
        }

        const getTexts = async function (index: number) {
            await seek(index)
            if (!cache.has(index)) cache.set(index, fetchTexts())
            const texts = await cache.get(index)
            if (!cache.has(index + 1)) cache.set(index + 1, prefetchTexts(index))
            return texts
        }

        function simulateClick(elementToClick: HTMLElement) {
            const simulateMouseEvent = function (element: HTMLElement, eventName: string, coordX: number, coordY: number) {
                element.dispatchEvent(new MouseEvent(eventName, {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: coordX,
                    clientY: coordY,
                    button: 0
                }));
            }
            const box = elementToClick.getBoundingClientRect(),
                coordX = box.left + (box.right - box.left) / 2,
                coordY = box.top + (box.bottom - box.top) / 2;
            simulateMouseEvent(elementToClick, "mousedown", coordX, coordY);
            simulateMouseEvent(elementToClick, "mouseup", coordX, coordY);
            simulateMouseEvent(elementToClick, "click", coordX, coordY);
        }

        function waitMillis(millis: number) {
            return new Promise(function (fulfill) {
                setTimeout(fulfill, millis);
            });
        }

        const seek = function (index: number) {
            for (; currentIndex < index; currentIndex++) {
                const rightChevron = document.getElementById("kr-chevron-right")
                if (rightChevron !== null) {
                    simulateClick(rightChevron)
                }
            }
            for (; currentIndex > index; currentIndex--) {
                const leftChevron = document.getElementById("kr-chevron-left")
                if (leftChevron !== null)
                    simulateClick(leftChevron)
            }
            return waitMillis(150)
        }

        async function fetchTexts(): Promise<Blob> {
            const image = await capturePage()
            // return ocr.getTexts(image, true)
            return Promise.resolve(image);
        }

        async function prefetchTexts(index: number) {
            try {
                await seek(index + 1)
                const image = await capturePage()
                // return ocr.getTexts(image, false)
                return Promise.resolve(image);
            } finally {
                await seek(index)
            }
        }

        function capturePage(): Promise<Blob> {
            const img = document.querySelector(".kg-full-page-img > img")
            if(!(img instanceof HTMLImageElement)) throw new Error("Image not found")
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            if (ctx === null) throw new Error("Canvas context is null")
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(img, 0, 0)
            return new Promise((resolve, reject) => {
                canvas.toBlob(blob => {
                    if (blob === null) return reject(new Error("Canvas to blob failed"))
                    resolve(blob)
                })
            })
        }

        // console.log('Received response from background:', res);
        setTimeout(async () => {
            // const texts = await getTexts(10)
            // console.log(texts)
            sendMessage('ping', {sync: false}, 'side-panel').then(res => {
                console.log('Received response from background:', res);
            });

        }, 4000)
    },
});


