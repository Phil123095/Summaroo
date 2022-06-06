function HeaderBar2() {
    return (
        <header class="w-full">
            <nav class="flex min-w-full items-center justify-center flex-wrap bg-neutral-100 py-8 px-8">
                <a href="/" class="flex w-full lg:w-fit justify-center lg:justify-start items-center flex-shrink-0 text-black lg:mx-6 hover:no-underline"> 
                    <span class="font-bold text-5xl tracking-tight hover:font-bold pl-1">Summaroo </span>
                </a>
                <div class="flex lg:w-fit flex-grow justify-center lg:justify-end">
                    <div class="flex w-full lg:w-fit text-sm justify-center space-x-2 lg:justify-end lg:mr-6 lg:px-2 hover:no-underline">
                        <button class="rounded-lg w-24 my-2 mx-2 bg-green-primary bg-opacity-90">
                            <a href="/summarize" class="inline-block text-center py-2 align-center text-white text-base rounded hover:no-underline">
                                Sign Up
                            </a>
                        </button>
                        <button class="border rounded-lg w-24 my-2 mx-2 border-green-primary">
                            <a href="/kangaroos" class="inline-block text-center py-2 align-center text-green-primary text-base hover:no-underline">
                                Login
                            </a>
                        </button>
                        
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default HeaderBar2;