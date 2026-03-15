import { FileUploadBox } from "@/components/file-drop-box";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Navbar } from "@/components/navbar";

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Navbar />
      <h1 className="text-6xl font-bold mb-6 ml-5 mt-15">What's your idea?</h1>
      <FileUploadBox />
      <p>or</p>
      <input type="text"
        placeholder="Describe your outfit idea"
        className="input input-bordered w-full max-w-md border-solid border-1" />

      <Dialog>
        <DialogTrigger className="px-4 py-2 rounded-xl border-3 border-solid
        hover:bg-gray-100 transition-colors duration-200">
          Go
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Outfit options</DialogTitle>
            <DialogDescription className="flex flex-col items-center gap-4 p-4">
              <p>Outfit ideas!</p>
              <Carousel className="w-40" opts={{
                loop: true,
              }}>
                <CarouselContent>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="overcoat1" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="overcoat2" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="overcoat3" /></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <Carousel className="w-40" opts={{
                loop: true,
              }}>
                <CarouselContent>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="top1" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="top2" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="top3" /> </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <Carousel className="w-40" opts={{
                loop: true,
              }}>
                <CarouselContent>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="bottom1" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="bottom2" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="bottom3" /></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <Carousel className="w-40" opts={{
                loop: true,
              }}>
                <CarouselContent>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="shoes1" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="shoes2" /></CarouselItem>
                  <CarouselItem><img className="h-30 w-40 object-scale-down" src={"https://avatar.vercel.sh/shadcn1"} alt="shoes3" /></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

