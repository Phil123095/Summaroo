export default function NotFound() {
    return (
      <div class="flex flex-col h-fit items-center justify-center">
        <div class="my-72 text-center">
          <h1 class="text-6xl font-bold mb-8">404 Error</h1>
          <h1 class="text-xl font-medium mb-1">Sorry, page not found!</h1>
          <a href="/" class="underline font-italic">Let me take you home</a>
        </div>
      </div>
    );
  }