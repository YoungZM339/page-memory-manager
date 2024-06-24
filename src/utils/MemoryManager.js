class PageTableEntry {
    constructor(pageNumber, frameNumber = null, valid = false) {
        this.pageNumber = pageNumber;
        this.frameNumber = frameNumber;
        this.valid = valid;
    }
}

class Frame {
    constructor(frameNumber, pageNumber = null) {
        this.frameNumber = frameNumber;
        this.pageNumber = pageNumber;
    }
}

class LRUQueue {
    constructor() {
        this.queue = [];
    }

    accessPage(pageNumber) {
        const index = this.queue.indexOf(pageNumber);
        if (index !== -1) {
            this.queue.splice(index, 1);
        }
        this.queue.push(pageNumber);
    }

    getLRUPage() {
        return this.queue.shift();
    }
}

function handlePageRequest(pageNumber, pageTable, frames, lruQueue) {
    const pageEntry = pageTable[pageNumber];
    let pageFault = false;
    let replacedPage = null;

    if (pageEntry.valid) {
        lruQueue.accessPage(pageNumber);
    } else {
        pageFault = true;
        const freeFrame = frames.find(frame => frame.pageNumber === null);
        if (freeFrame) {
            freeFrame.pageNumber = pageNumber;
            pageEntry.frameNumber = freeFrame.frameNumber;
            pageEntry.valid = true;
            lruQueue.accessPage(pageNumber);
        } else {
            const lruPage = lruQueue.getLRUPage();
            replacedPage = lruPage;
            const lruPageEntry = pageTable[lruPage];
            const frameToReplace = frames.find(frame => frame.pageNumber === lruPage);

            frameToReplace.pageNumber = pageNumber;
            pageEntry.frameNumber = frameToReplace.frameNumber;
            pageEntry.valid = true;
            lruPageEntry.valid = false;
            lruPageEntry.frameNumber = null;
            lruQueue.accessPage(pageNumber);
        }
    }

    return { pageFault, replacedPage };
}
export { PageTableEntry, Frame, LRUQueue, handlePageRequest };