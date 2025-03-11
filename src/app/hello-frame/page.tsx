import type { Metadata } from 'next';

const appUrl = process.env.NEXT_PUBLIC_URL;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hello World Frame',
    description: 'My first Frame using Frame v2',
    openGraph: {
      title: 'Hello World Frame',
      description: 'My first Frame using Frame v2',
      images: [`${appUrl}/api/hello-image`],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': `${appUrl}/api/hello-image`,
      'fc:frame:button:1': 'Say Hello!',
      'fc:frame:post_url': `${appUrl}/api/hello-frame`,
    },
  };
}

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-3xl font-bold">Hello World Frame</h1>
        <p className="mt-4 text-lg">
          This is a simple Hello World Frame built with Frame v2
        </p>
      </main>
    </div>
  );
}