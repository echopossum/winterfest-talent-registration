import { addClient, removeClient } from '$lib/server/events';

export async function GET() {
	const headers = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	};

	const stream = new ReadableStream({
		start(controller) {
			addClient(controller);
			controller.enqueue(`event: connected\ndata:connected\n\n`);

			const timer = setInterval(() => {
				try {
					controller.enqueue(`event: ping\ndata:${Date.now()}\n\n`);
				} catch {
					clearInterval(timer);
					removeClient(controller);
				}
			}, 10000);

			return () => {
				clearInterval(timer);
				removeClient(controller);
			};
		}
	});
	return new Response(stream, { headers });
}
