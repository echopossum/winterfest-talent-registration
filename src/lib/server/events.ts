const clients = new Set<ReadableStreamDefaultController>();

export function addClient(controller: ReadableStreamDefaultController) {
	clients.add(controller);
}

export function removeClient(controller: ReadableStreamDefaultController) {
	clients.delete(controller);
}

export function broadcast(event: string, data: unknown) {
	const payload = `event: ${event}\ndata:${JSON.stringify(data)}\n\n`;
	console.log('broadcasting data');
	for (const controller of clients) {
		try {
			controller.enqueue(payload);
			console.log('sending');
		} catch {
			clients.delete(controller);
		}
	}
}
