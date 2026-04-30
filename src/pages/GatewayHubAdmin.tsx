import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { api, Brochure, clearToken, getToken } from "@/lib/api";
import { brochures as fallbackBrochures } from "@/data/brochures";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";

type FormState = {
  slug: string;
  title: string;
  category: string;
  thumbnail: File | null;
  pdf: File | null;
  editingSlug: string | null;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  category: "",
  thumbnail: null,
  pdf: null,
  editingSlug: null,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const Admin = () => {
  const nav = useNavigate();
  const [items, setItems] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "GatewayHub Admin — Portfolio";
    if (!getToken()) {
      nav("/gatewayhub", { replace: true });
      return;
    }
    void load();
  }, [nav]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.list();
      setItems(data);
    } catch (err) {
      // Fallback to static list so the panel is usable even if API isn't deployed yet
      setItems(
        fallbackBrochures.map((b, i) => ({ ...b, order: i, thumbnail: `/brochures/${b.slug}/thumbnail.jpg`, pdf: `/brochures/${b.slug}/file.pdf` })),
      );
      toast.error(err instanceof Error ? err.message : "Could not reach API — showing static list");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    nav("/gatewayhub", { replace: true });
  };

  const startEdit = (b: Brochure) => {
    setForm({
      slug: b.slug,
      title: b.title,
      category: b.category,
      thumbnail: null,
      pdf: null,
      editingSlug: b.slug,
    });
    setShowForm(true);
  };

  const startCreate = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category.trim()) {
      toast.error("Title and category are required");
      return;
    }
    const slug = form.editingSlug ?? (form.slug.trim() || slugify(form.title));
    if (!form.editingSlug && (!form.thumbnail || !form.pdf)) {
      toast.error("Thumbnail and PDF are required for new items");
      return;
    }
    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("title", form.title.trim());
    fd.append("category", form.category.trim());
    if (form.thumbnail) fd.append("thumbnail", form.thumbnail);
    if (form.pdf) fd.append("pdf", form.pdf);

    setSubmitting(true);
    try {
      if (form.editingSlug) {
        await api.update(form.editingSlug, fd);
        toast.success("Updated");
      } else {
        await api.create(fd);
        toast.success("Created");
      }
      setShowForm(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This removes the files too.`)) return;
    try {
      await api.remove(slug);
      toast.success("Deleted");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next);
    try {
      await api.reorder(next.map((b) => b.slug));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reorder failed");
      await load();
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-accent" />
            GatewayHub <span className="text-muted-foreground font-normal text-sm">/ Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={startCreate} className="rounded-full">
              <Plus size={16} /> New brochure
            </Button>
            <Button size="sm" variant="ghost" onClick={logout}>
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </header>

      <section className="container py-10">
        {showForm && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl">{form.editingSlug ? "Edit brochure" : "New brochure"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X size={18} />
              </Button>
            </div>
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} maxLength={100} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} maxLength={60} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
              {!form.editingSlug && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="slug">Slug (optional — auto-generated from title)</Label>
                  <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder={slugify(form.title) || "my-brochure"} />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail (JPG/PNG/WEBP){form.editingSlug && " — leave empty to keep"}</Label>
                <Input id="thumbnail" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] ?? null })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pdf">PDF{form.editingSlug && " — leave empty to keep"}</Label>
                <Input id="pdf" type="file" accept="application/pdf" onChange={(e) => setForm({ ...form, pdf: e.target.files?.[0] ?? null })} />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting} className="rounded-full">
                  {submitting ? "Saving…" : form.editingSlug ? "Save changes" : "Create"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-3">
          {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
          {!loading && items.length === 0 && <p className="text-muted-foreground text-sm">No brochures yet — add your first.</p>}
          {items.map((b, i) => (
            <Card key={b.slug} className="p-4 flex items-center gap-4">
              <img
                src={b.thumbnail || `/brochures/${b.slug}/thumbnail.jpg`}
                alt=""
                className="w-16 h-20 object-cover rounded-md bg-secondary flex-shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <div className="font-display font-medium truncate">{b.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {b.category} · <code>{b.slug}</code>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  <ArrowUp size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                  <ArrowDown size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => startEdit(b)} aria-label="Edit">
                  <Pencil size={16} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(b.slug)} aria-label="Delete">
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Admin;
