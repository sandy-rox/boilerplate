#!/bin/bash

# Build Docker image
docker build -t boilerplate .

# Run the Docker container
docker run -d -p 3000:3000 boilerplate

