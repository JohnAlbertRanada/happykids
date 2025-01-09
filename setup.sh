#!/bin/bash

# Download the precompiled FFmpeg binary
curl -sSL https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz -o ffmpeg.tar.xz

# Extract the archive
tar -xf ffmpeg.tar.xz

# Move the binaries to /usr/local/bin
mv ffmpeg*/ffmpeg /usr/local/bin/
mv ffmpeg*/ffprobe /usr/local/bin/

# Clean up the extracted files
rm -rf ffmpeg*
