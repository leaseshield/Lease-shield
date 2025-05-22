#!/bin/bash

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "ffmpeg is not installed. Please install it first."
    echo "On macOS: brew install ffmpeg"
    echo "On Ubuntu: sudo apt-get install ffmpeg"
    exit 1
fi

# Input and output file paths
INPUT_FILE="public/Product Launch Video.mp4"
OUTPUT_FILE="public/Product Launch Video_compressed.mp4"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Input file not found: $INPUT_FILE"
    exit 1
fi

# Compress video
echo "Compressing video..."
ffmpeg -i "$INPUT_FILE" \
    -vcodec h264 \
    -acodec aac \
    -strict -2 \
    -b:v 1M \
    -b:a 128k \
    -movflags +faststart \
    "$OUTPUT_FILE"

# Check if compression was successful
if [ $? -eq 0 ]; then
    echo "Compression successful!"
    echo "Original size: $(du -h "$INPUT_FILE" | cut -f1)"
    echo "Compressed size: $(du -h "$OUTPUT_FILE" | cut -f1)"
    
    # Ask if user wants to replace original
    read -p "Do you want to replace the original file with the compressed version? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mv "$OUTPUT_FILE" "$INPUT_FILE"
        echo "Original file replaced with compressed version."
    fi
else
    echo "Compression failed!"
fi 