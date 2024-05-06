export default defineContentScript({
    matches: ['*://*/*'],

    main(ctx) {
        console.log('Hello content from all content script.');
    },
});