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

class FIFOQueue {
    constructor() {
        this.queue = [];
    }

    addPage(pageNumber) {
        this.queue.push(pageNumber);
    }

    getFIFOPage() {
        return this.queue.shift();
    }
}

function handlePageRequest(pageNumber, pageTable, frames, algorithmQueue, algorithm) {
    const pageEntry = pageTable[pageNumber];
    let pageFault = false;
    let replacedPage = null;

    if (pageEntry.valid) {
        if (algorithm === 'LRU') {
            algorithmQueue.accessPage(pageNumber);
        }
    } else {
        pageFault = true;
        const freeFrame = frames.find(frame => frame.pageNumber === null);
        if (freeFrame) {
            freeFrame.pageNumber = pageNumber;
            pageEntry.frameNumber = freeFrame.frameNumber;
            pageEntry.valid = true;
            if (algorithm === 'LRU') {
                algorithmQueue.accessPage(pageNumber);
            } else if (algorithm === 'FIFO') {
                algorithmQueue.addPage(pageNumber);
            }
        } else {
            let replacedPageNumber;
            if (algorithm === 'LRU') {
                replacedPageNumber = algorithmQueue.getLRUPage();
            } else if (algorithm === 'FIFO') {
                replacedPageNumber = algorithmQueue.getFIFOPage();
            }
            replacedPage = replacedPageNumber;
            const replacedPageEntry = pageTable[replacedPageNumber];
            const frameToReplace = frames.find(frame => frame.pageNumber === replacedPageNumber);

            frameToReplace.pageNumber = pageNumber;
            pageEntry.frameNumber = frameToReplace.frameNumber;
            pageEntry.valid = true;
            replacedPageEntry.valid = false;
            replacedPageEntry.frameNumber = null;
            if (algorithm === 'LRU') {
                algorithmQueue.accessPage(pageNumber);
            } else if (algorithm === 'FIFO') {
                algorithmQueue.addPage(pageNumber);
            }
        }
    }

    return { pageFault, replacedPage };
}

export { PageTableEntry, Frame, LRUQueue, FIFOQueue, handlePageRequest };
