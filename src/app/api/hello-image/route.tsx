import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: 'white',
          background: 'linear-gradient(to bottom, #0047AB, #4169E1)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 50,
        }}
      >
        <div style={{ marginBottom: 20 }}>Hello World Frame!</div>
        <div style={{ fontSize: 30 }}>Click the button below to say hello</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}