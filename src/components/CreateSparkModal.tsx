import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Zap,
  ImagePlus,
  Video,
  Bold,
  Italic,
  Quote,
  Heading2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";

type SparkType = "article" | "short";

interface CreateSparkModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CATEGORIES = [
  "Neuroscience","Culture","Mathematics","Astronomy","Biology",
  "History","Philosophy","Technology","Psychology","Economics","Art",
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80",
];

const CreateSparkModal = (props: CreateSparkModalProps) => {
  const { addSpark } = useApp();

  const isOpen = props.isOpen ?? props.open ?? false;
  const onClose = props.onClose ?? (() => props.onOpenChange?.(false));

  const [sparkType, setSparkType] = useState<SparkType | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [mediaFiles, setMediaFiles] = useState<
    { file: File; preview: string; type: "image" | "video" }[]
  >([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const SHORT_LIMIT = 280;

  const reset = () => {
    setSparkType(null);
    setTitle("");
    setBody("");
    setCategory("");
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
    setMediaFiles([]);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((file) => ({
      file, preview: URL.createObjectURL(file), type,
    }));
    setMediaFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const [publishing, setPublishing] = useState(false);

  const canPublish =
    sparkType && body.trim().length > 0 &&
    (sparkType === "short" || title.trim().length > 0);

  const handlePublish = async () => {
    if (!canPublish || publishing) return;
    setPublishing(true);
    try {
      await addSpark({
        title: sparkType === "article" ? title.trim() : body.trim().slice(0, 60),
        excerpt: body.trim().slice(0, 160),
        author: { id: "", name: "" },
        category: category || "Culture",
        readTime: Math.max(1, Math.ceil(body.split(" ").length / 200)),
        image: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
        publishedAt: new Date().toISOString(),
        contentBlocks: [{ type: "paragraph" as const, content: body.trim() }],
        status: "published" as const,
      });
      handleClose();
    } catch {
      // error silently — could add toast here
    } finally {
      setPublishing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-background shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-foreground">
                {!sparkType ? "Create a Spark" : sparkType === "article" ? "Write an Article" : "Short Spark"}
              </h2>
              <button onClick={handleClose} className="rounded-sm p-1 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {!sparkType && (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setSparkType("article")}
                    className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-8 transition-all hover:border-accent hover:shadow-md">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-sans text-sm font-semibold text-foreground">Article</p>
                      <p className="mt-1 font-sans text-xs text-muted-foreground">Long-form with rich formatting</p>
                    </div>
                  </button>
                  <button onClick={() => setSparkType("short")}
                    className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-8 transition-all hover:border-accent hover:shadow-md">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Zap className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-sans text-sm font-semibold text-foreground">Short Spark</p>
                      <p className="mt-1 font-sans text-xs text-muted-foreground">Quick thought · {SHORT_LIMIT} chars</p>
                    </div>
                  </button>
                </div>
              )}

              {sparkType && (
                <div className="flex flex-col gap-5">
                  {sparkType === "article" && (
                    <div>
                      <Input placeholder="Give your article a title…" value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border-none bg-transparent px-0 font-serif text-2xl font-bold placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                        maxLength={120} />
                      <p className="mt-1 text-right font-sans text-xs text-muted-foreground">{title.length}/120</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)}
                        className={`rounded-full px-3 py-1 font-sans text-xs font-medium transition-colors ${
                          category === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  {sparkType === "article" && (
                    <div className="flex gap-1 border-b border-border pb-3">
                      {[{ icon: Bold, label: "Bold" }, { icon: Italic, label: "Italic" },
                        { icon: Heading2, label: "Heading" }, { icon: Quote, label: "Quote" }].map(({ icon: Icon, label }) => (
                        <button key={label} className="rounded-sm p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" title={label}>
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Textarea
                      placeholder={sparkType === "article" ? "Start writing your article…" : "What's on your mind?"}
                      value={body}
                      onChange={(e) => {
                        if (sparkType === "short" && e.target.value.length > SHORT_LIMIT) return;
                        setBody(e.target.value);
                      }}
                      className={`resize-none border-none bg-transparent px-0 font-sans text-base placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                        sparkType === "article" ? "min-h-[200px]" : "min-h-[120px]"
                      }`} />
                    {sparkType === "short" && (
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(body.length / SHORT_LIMIT) * 100}%` }} />
                        </div>
                        <span className={`font-mono text-xs ${body.length > SHORT_LIMIT * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
                          {body.length}/{SHORT_LIMIT}
                        </span>
                      </div>
                    )}
                  </div>

                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {mediaFiles.map((media, i) => (
                        <div key={i} className="group relative aspect-video overflow-hidden rounded-md border border-border bg-secondary">
                          {media.type === "image"
                            ? <img src={media.preview} alt="" className="h-full w-full object-cover" />
                            : <video src={media.preview} className="h-full w-full object-cover" muted />}
                          <button onClick={() => removeMedia(i)}
                            className="absolute right-1.5 top-1.5 rounded-full bg-background/80 p-1 text-destructive opacity-0 transition-opacity group-hover:opacity-100">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex gap-2">
                      <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleMediaUpload(e, "image")} />
                      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleMediaUpload(e, "video")} />
                      <button onClick={() => imageInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-sm px-3 py-2 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <ImagePlus className="h-4 w-4" /> Image
                      </button>
                      <button onClick={() => videoInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-sm px-3 py-2 font-sans text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <Video className="h-4 w-4" /> Video
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={reset}>Back</Button>
                      <Button size="sm" disabled={!canPublish || publishing} onClick={handlePublish}
                        className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateSparkModal;
