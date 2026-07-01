const chats = [
  { name: "Ava", message: "See you at 7:00 PM", time: "09:41", unread: 2, tone: "bg-emerald-500" },
  { name: "Noah", message: "The design looks great", time: "08:15", unread: 0, tone: "bg-sky-500" },
  { name: "Mia", message: "Let's ship this today ✨", time: "Yesterday", unread: 1, tone: "bg-violet-500" },
  { name: "Leo", message: "Uploaded the latest assets", time: "Yesterday", unread: 0, tone: "bg-amber-500" },
];

const messages = [
  { sender: "them", text: "Hi! I prepared the wireframe for the new chat experience." },
  { sender: "me", text: "Perfect. I love the clean layout and the green accent." },
  { sender: "them", text: "I also added a small status preview for quick updates." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eae6df] p-3 sm:p-6 lg:p-8">
      <main className="mx-auto flex max-w-6xl overflow-hidden rounded-[32px] border border-stone-200 bg-[#f0f2f5] shadow-[0_20px_80px_rgba(0,0,0,0.16)]">
        <aside className="flex w-full max-w-sm flex-col border-r border-stone-200 bg-[#f8fafc]">
          <div className="flex items-center justify-between border-b border-stone-200 bg-[#075e54] px-4 py-4 text-white">
            <div>
              <p className="text-sm font-semibold">WhatsApp Sample</p>
              <p className="text-xs text-emerald-100">Your chats</p>
            </div>
            <div className="rounded-full bg-white/20 px-3 py-1 text-sm">● Online</div>
          </div>

          <div className="border-b border-stone-200 bg-white px-4 py-3">
            <div className="flex items-center rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-500">
              <span className="mr-2 text-base">🔎</span>
              Search chats
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.name}
                className="flex w-full items-center gap-3 border-b border-stone-200 px-4 py-3 text-left transition hover:bg-stone-100"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${chat.tone}`}>
                  {chat.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-semibold text-stone-800">{chat.name}</p>
                    <p className="text-xs text-stone-500">{chat.time}</p>
                  </div>
                  <p className="truncate text-sm text-stone-500">{chat.message}</p>
                </div>
                {chat.unread > 0 ? (
                  <div className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                    {chat.unread}
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </aside>

        <section className="hidden flex-1 flex-col lg:flex">
          <div className="flex items-center justify-between border-b border-stone-200 bg-[#075e54] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                AV
              </div>
              <div>
                <p className="font-semibold">Ava</p>
                <p className="text-xs text-emerald-100">Typing...</p>
              </div>
            </div>
            <div className="flex gap-2 text-lg">
              <span>📞</span>
              <span>📹</span>
              <span>⋯</span>
            </div>
          </div>

          <div className="flex-1 space-y-3 bg-[radial-gradient(circle_at_top_left,_rgba(7,94,84,0.08),_transparent_40%)] p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    message.sender === "me"
                      ? "bg-[#dcf8c6] text-stone-800"
                      : "bg-white text-stone-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2">
              <span className="text-lg">😊</span>
              <input
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder="Type a message"
                readOnly
                value=""
              />
              <button className="rounded-full bg-[#075e54] px-3 py-2 text-sm font-semibold text-white">
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
