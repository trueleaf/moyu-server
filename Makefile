GITTAG = $(shell git describe --abbrev=0 --tags)
BUILD_TIME=$(shell date +%FT%T%z)
CURRENT_PATH = $(shell pwd)
TARGET = moyu-server
VERSION = $(GITTAG:v%=%)

IMAGE_REPO = ...
IMAGE = $(TARGET):$(VERSION)
LATEST_IMAGE = $(TARGET):latest

start:
	npm install
	npm run dev
	@echo "Done."

image:
	docker build --build-arg version=$(VERSION) -t $(IMAGE) -t $(LATEST_IMAGE) -f Dockerfile .

push-image:
	docker tag $(LATEST_IMAGE) $(IMAGE_REPO)/$(LATEST_IMAGE)
	docker tag $(IMAGE) $(IMAGE_REPO)/$(IMAGE)
	docker push $(IMAGE_REPO)/$(LATEST_IMAGE)
	docker push $(IMAGE_REPO)/$(IMAGE)
	@echo "Done."

container:
	docker compose up -d
	@echo "Done."

stop:
	docker compose stop
	@echo "Done."

.PHONY: start image push-image container stop