function HeaderBar2() {
    return (
        <header class="w-full">
            <nav class="flex min-w-full items-center justify-center flex-wrap bg-neutral-100 py-8 px-8">
                <a href="/" class="flex items-center flex-shrink-0 text-black mx-6 hover:no-underline"> 
                    <span class="font-bold text-5xl tracking-tight hover:font-bold pl-1">Summaroo </span>
                </a>
                <div class="flex w-fit flex-grow justify-end">
                    <div class="text-sm justify-end align-items-center mr-6 hover:no-underline">
                        <a href="/fun-version" class="inline-block my-4 mx-2 align-center text-black text-base rounded hover:no-underline">
                            Register
                        </a>
                        <a href="/kangaroos"  class="inline-block my-4 mx-2 align-center text-black text-base hover:no-underline">
                            Login
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default HeaderBar2;