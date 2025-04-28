import DraggableCardList from "@/components/draggable-card-list"

export default function Home() {
  return (
    <main className="bg-stone-50 min-h-screen">
      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-[640px] mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left text-stone-800">Links</h1>
          <p className="text-stone-500 mb-8 text-center md:text-left">
            Prototype to explore insertion point and drag and drop behavior. Ignore the visual design of the link blocks
            and group.
          </p>
          <DraggableCardList />
        </div>
      </div>
    </main>
  )
}
