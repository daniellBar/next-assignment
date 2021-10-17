export function query(selector, scope) {
	// view constructor is the only place where query is used and it get no scope input param
	// if(scope === null) throw 'query scope cannot be null';
	return (scope || document).querySelector(selector);
}

export function listen(target, type, callback, capture) {
	target.addEventListener(type, callback, !!capture);
}

export function delegateEvent(target, selector, type, handler, capture) {
	const dispatchEvent = event => {
		const targetElement = event.target;
		const potentialElements = target.querySelectorAll(selector);
		let i = potentialElements.length;

		while (i--) {
			if (potentialElements[i] === targetElement) {
				handler.call(targetElement, event);
				break;
			}
		}
	};

	listen(target, type, dispatchEvent, !!capture);
}

export const escapeForHTML = s => s.replace(/[&<]/g, c => c === '&' ? '&amp;' : '&lt;');

