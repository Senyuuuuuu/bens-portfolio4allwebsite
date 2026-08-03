FROM node:20-alpine

# Install system dependencies for video processing
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    py3-pip \
    curl \
    bash \
    && pip3 install --break-system-packages yt-dlp openai-whisper 2>/dev/null || \
       pip3 install yt-dlp openai-whisper

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Create directories
RUN mkdir -p /app/storage /app/uploads /app/temp /app/logs

EXPOSE 4000 4001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]
