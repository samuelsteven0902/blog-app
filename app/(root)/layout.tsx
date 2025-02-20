import Navbar from "@/components/Navbar";

export default function Layout({ children } : Readonly<{ children: React.ReactNode }>){
    return(
        <main className="font-work-sans">
            <Navbar />
            {children}
            <footer className="bg-gray-900 text-white py-6 px-4">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
                    {/* Copyright */}
                    <p className="mb-2 md:mb-0 text-gray-400">
                    © {new Date().getFullYear()} Samuel Steven. All rights reserved.
                    </p>

                    {/* Links */}
                    <div className="flex space-x-6">
                    <a 
                        href="https://blog.samuelstevenph.com/privacy-policy" 
                        className="hover:text-gray-300 transition"
                    >
                        Privacy Policy
                    </a>
                    {/* <a 
                        href="https://samuelstevenph.com/terms" 
                        className="hover:text-gray-300 transition"
                    >
                        Terms of Service
                    </a> */}
                    <a 
                        href="mailto:contact@samuelstevenph.com" 
                        className="hover:text-gray-300 transition"
                    >
                        Contact
                    </a>
                    </div>
                </div>
                </footer>

        </main>
    )
}