component: component.json client.js
	@component install
	@component build

test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter spec

.PHONY: test
