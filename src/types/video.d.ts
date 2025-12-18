export { }

declare global {
    interface HTMLVideoElement {
        controlsList: DOMTokenList
        disablePictureInPicture: boolean
    }
}
