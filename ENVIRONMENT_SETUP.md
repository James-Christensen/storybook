# Development Environment Setup

## Required Local Services

### Ollama Setup
- Version requirements
- Model installation steps
- Configuration for story generation
- Current endpoint: `http://192.168.0.131:11434/api/generate`

### DrawThings/Flux Setup
- Version requirements
- Model and LoRA installation
- Configuration settings
- Current endpoint: `http://192.168.0.131:7860/sdapi/v1/txt2img`

## Environment Variables
```bash
# Required environment variables for local development
OLLAMA_URL=http://192.168.0.131:11434/api/generate
FLUX_URL=http://192.168.0.131:7860/sdapi/v1/txt2img
OLLAMA_MODEL=phi4
FLUX_MODEL=flux_1_schnell_q5p.ckpt
``` 