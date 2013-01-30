
build:
	mkdir -p build
	./bin/compile-templates
	browserify client/boot/index.js -o build/build.js
	sass client/boot/main.scss --load-path client/ --compass > build/build.css

all: build

.PHONY: build