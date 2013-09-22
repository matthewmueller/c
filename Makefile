component: component.json client.js
	@component install
	@component build

test:
	@./node_modules/.bin/mocha \
		--reporter spec

.PHONY: test
