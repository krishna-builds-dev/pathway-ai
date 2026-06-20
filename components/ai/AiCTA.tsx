export default function AiCTA() {
    return (

        <section className="py-stack-lg px-margin">
            <div className="max-w-container-max mx-auto bg-primary rounded-[32px] p-8 md:p-16 text-center text-on-primary relative overflow-hidden shadow-2xl">

                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-container/30 rounded-full -ml-48 -mb-48 blur-3xl"></div>
                <div className="relative z-10">
                    <h2 className="font-display-xl text-[40px] md:text-display-xl mb-6">Unlock the Full Power of Pathway AI</h2>
                    <p className="font-body-lg text-body-lg opacity-90 mb-10 max-w-2xl mx-auto">
                        Join 50,000+ students who have successfully navigated their study abroad applications using our AI hub.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-white text-primary font-ui-sm text-ui-sm px-10 py-5 rounded-xl font-bold shadow-sm hover:bg-on-primary-container transition-all active:scale-95">
                            Get Started for Free
                        </button>
                        <button className="bg-white/10 border border-white/20 text-on-primary font-ui-sm text-ui-sm px-10 py-5 rounded-xl font-bold hover:bg-white/20 transition-all">
                            Talk to AI Advisor
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}