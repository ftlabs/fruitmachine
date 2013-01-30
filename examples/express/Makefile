
build:
	mkdir -p build
	./bin/compile-templates
	browserify lib/boot/index.js -o build/build.js
	sass lib/boot/main.scss --load-path lib/ --compass > build/build.css

all: build

.PHONY: build