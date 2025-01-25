import { NextResponse } from 'next/server';

const FLUX_CONFIG = {
  serverIP: '192.168.0.131',
  port: '7860',
  baseURL: function() {
    return `http://${this.serverIP}:${this.port}`;
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Proxying image generation request to Flux API');
    
    const endpoint = `${FLUX_CONFIG.baseURL()}/sdapi/v1/txt2img`;
    console.log('Flux API endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flux API error:', errorText);
      return NextResponse.json({ error: `Image generation failed: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in image generation proxy:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
} 