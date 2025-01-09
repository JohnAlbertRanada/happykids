# Use an official Python image as a base
FROM python:3.11-slim

# Install dependencies and FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*  # Clean up apt cache

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy your app files into the container
COPY . /app
WORKDIR /app