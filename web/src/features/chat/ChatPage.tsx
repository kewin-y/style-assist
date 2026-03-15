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

export default function ChatPage() {
  return (
    <div>
      <h1>What's your idea?</h1>
      <FileUploadBox />
      <p>or</p>
      <input type="text"
        placeholder="Describe your outfit idea"
        className="input input-bordered w-full max-w-md" />

      <Dialog>
        <DialogTrigger>Go</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Outfit options</DialogTitle>
            <DialogDescription>
              <Carousel>
                <CarouselContent>
                  <CarouselItem>top1</CarouselItem>
                  <CarouselItem>top2</CarouselItem>
                  <CarouselItem>top3</CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <Carousel>
                <CarouselContent>
                  <CarouselItem>bottom1</CarouselItem>
                  <CarouselItem>bottom2</CarouselItem>
                  <CarouselItem>bottom3</CarouselItem>
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

