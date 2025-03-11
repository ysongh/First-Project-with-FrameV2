import { NextRequest, NextResponse } from 'next/server';

const appUrl = process.env.NEXT_PUBLIC_URL;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = await req.json();
    
    // In a real app, you would validate the Frame message here
    
    // Create a frame response HTML
    const frameHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${appUrl}/api/hello-image?response=true&ts=${Date.now()}" />
          <meta property="fc:frame:button:1" content="Say Hello Again!" />
          <meta property="fc:frame:post_url" content="${appUrl}/api/hello-frame" />
          <meta property="fc:frame:input:text" content="Share your thoughts!" />
        </head>
        <body>
          <h1>Frame Response</h1>
        </body>
      </html>
    `;

    return new NextResponse(frameHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error in frame handler:', error);
    return new NextResponse('Error processing frame request', { status: 500 });
  }
}

// Add a GET handler for easier testing
export async function GET(req: NextRequest): Promise<NextResponse> {
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${appUrl}/api/hello-image" />
        <meta property="fc:frame:button:1" content="Say Hello!" />
        <meta property="fc:frame:post_url" content="${appUrl}/api/hello-frame" />
      </head>
      <body>
        <h1>Hello Frame</h1>
      </body>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}