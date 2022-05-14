function HeaderBar() {
    return (
        <header class="w-full">
            <nav class="flex min-w-full items-center justify-center flex-wrap bg-slate-800 py-3">
                <a href="/" class="flex items-center flex-shrink-0 text-white mx-6 hover:no-underline"> 
                    <span class="font-semibold text-xl tracking-tight hover:font-bold">Summaroo </span>
                    <span class="font-light text-l italic tracking-tight hover:font-semibold"> - Your content in a nutshell</span>
                    {/*<img class="fill-current h-10 w-10 ml-0.5" src={IberiAppLogo} alt="Logo"/>*/}
                </a>
                {/*<div class="flex w-fit flex-grow justify-end">
                    <div class="text-sm justify-end align-items-center mr-2 hover:no-underline">
                        <a href="/signup" class="inline-block my-4 mx-2 align-center text-white rounded hover:no-underline">
                            Register
                        </a>
                        <a href="/login"  class="inline-block my-4 mx-2 align-center text-white hover:no-underline">
                            Login
                        </a>
                    </div>
                </div>*/}
            </nav>
        </header>
    )
}

export default HeaderBar;