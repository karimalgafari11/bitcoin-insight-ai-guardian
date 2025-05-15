
// API Request Queue System
// Manages queuing and processing of API requests to prevent overwhelming external services

/**
 * Queue system to limit API requests
 */
const apiRequestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

/**
 * Process the queue one request at a time
 */
export async function processQueue() {
  if (isProcessingQueue || apiRequestQueue.length === 0) return;
  
  isProcessingQueue = true;
  try {
    // Take the next request from queue and execute it
    const nextRequest = apiRequestQueue.shift();
    if (nextRequest) {
      await nextRequest();
    }
  } catch (error) {
    console.error("Error processing queue item:", error);
  } finally {
    isProcessingQueue = false;
    // Continue processing if there are more items
    if (apiRequestQueue.length > 0) {
      setTimeout(processQueue, 250); // Small delay between requests
    }
  }
}

/**
 * Add a request to the queue
 */
export function enqueueRequest(requestFn: () => Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    apiRequestQueue.push(async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    
    // Start processing if not already running
    if (!isProcessingQueue) {
      processQueue();
    }
  });
}
