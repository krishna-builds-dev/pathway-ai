"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getResume, saveResume, generateResumeDraft } from "./actions";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useProfileCompleteness } from "@/hooks/useProfileCompleteness";
import RequireProfile from "@/components/providers/RequireProfile";

// Assign the vfs fonts
(pdfMake as any).vfs = pdfFonts;

const defaultSections = [
  {
    type: "heading",
    data: {
      name: "Your Name",
      title: "Your Title",
      email: "you@example.com",
      phone: "+977-9800000000",
      location: "City, Country",
      links: "Github, Linkedin, Website",
    },
  },
  {
    type: "summary",
    data: { content: "Write a brief professional summary..." },
  },
  {
    type: "education",
    data: {
      items: [
        {
          school: "Name",
          degree: "Degree Name",
          dates: "20XX-20XX",
          description: "Write a brief summary...",
        },
      ],
    },
  },
  {
    type: "experience",
    data: {
      items: [
        {
          company: "Name",
          role: "Role",
          dates: "20XX-20XX",
          description: "Write a brief summary...",
        },
      ],
    },
  },
  { type: "skills", data: { items: ["Skill 1", "Skill 2", "Skill 3"] } },
  { type: "languages", data: { items: ["Language 1", "Language 2", "Language 3"] } },
  { type: "certificates", data: { items: [{ name: "Name", issued_by: "Issued By", date_issued: "Date" }] } },
];

export default function ResumePage() {
  const [sections, setSections] = useState<any[]>(defaultSections);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(true);

  // Close editor by default on mobile screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setEditOpen(false);
    }
  }, []);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasSavedResume, setHasSavedResume] = useState(false);
  const isFirstRender = useRef(true);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Profile completeness hook
  const { profile, profileComplete, missingFields, loading: profileLoading } = useProfileCompleteness();

  // ── Load resume on mount (auto‑generate if none exists) ──
  useEffect(() => {
    (async () => {
      try {
        const { success, data, error } = await getResume();
        if (success && data) {
          if (data.sections) {
            // Saved resume exists – use it
            setSections(data.sections);
            setHasSavedResume(true);
          } else {
            // No saved resume → auto‑generate silently
            try {
              const genResult = await generateResumeDraft();
              if (genResult.success && genResult.sections) {
                setSections(genResult.sections);
                setHasSavedResume(false);
              } else {
                // generation failed – use placeholders
                setSections(defaultSections);
                setHasSavedResume(false);
              }
            } catch {
              // network error during generation – fallback to placeholders
              setSections(defaultSections);
              setHasSavedResume(false);
            }
          }
        } else {
          toast.error(error || "Failed to load resume");
          setSections(defaultSections);
          setHasSavedResume(false);
        }
      } catch {
        toast.error("Network error");
        setSections(defaultSections);
        setHasSavedResume(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── One‑time geo‑IP for location ──
  useEffect(() => {
    if (loading) return;
    const headingIndex = sections.findIndex((s: any) => s.type === "heading");
    if (headingIndex === -1) return;
    if (sections[headingIndex].data.location === "[Fetch Location]") {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          updateSection(headingIndex, "location", data.country_name || "");
        })
        .catch(() => {
          updateSection(headingIndex, "location", "");
        });
    }
  }, [loading, sections]);

  // ── Save handler ──
  const handleSave = useCallback(async (sectionsToSave: any[]) => {
    setSaving(true);
    try {
      const { success, error } = await saveResume(sectionsToSave);
      if (!success) toast.error(error || "Failed to save");
      else setHasSavedResume(true);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, []);

  // ── Autosave (skip first render) ──
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (loading || sections.length === 0) return;
    const timer = setTimeout(() => handleSave(sections), 1500);
    return () => clearTimeout(timer);
  }, [sections, loading, handleSave]);

  // ── Generate from Profile (manual call, optionally silent) ──
  const handleGenerateFromProfile = async (silent = false) => {
    setGenerating(true);
    try {
      const result = await generateResumeDraft();
      if (result.success && result.sections) {
        setSections(result.sections);
        setHasSavedResume(false);
        if (!silent) toast.success("Generated With Pathway AI.");
      } else {
        toast.error(result.error || "Failed to generate resume.");
      }
    } catch {
      toast.error("Network error during generation.");
    } finally {
      setGenerating(false);
    }
  };

  // ── Section handlers ──
  const updateSection = (index: number, field: string, value: any) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, data: { ...s.data, [field]: value } } : s
      )
    );
  };

  const addItemToSection = (index: number, itemTemplate: any) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === index && s.data.items
          ? { ...s, data: { ...s.data, items: [...s.data.items, itemTemplate] } }
          : s
      )
    );
  };

  const removeItemFromSection = (secIdx: number, itemIdx: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === secIdx && s.data.items
          ? {
            ...s,
            data: {
              ...s.data,
              items: s.data.items.filter((_: any, j: number) => j !== itemIdx),
            },
          }
          : s
      )
    );
  };

  const updateItemInSection = (
    secIdx: number,
    itemIdx: number,
    field: string,
    value: any
  ) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === secIdx && s.data.items
          ? {
            ...s,
            data: {
              ...s.data,
              items: s.data.items.map((item: any, j: number) =>
                j === itemIdx ? { ...item, [field]: value } : item
              ),
            },
          }
          : s
      )
    );
  };

  // ── Export (Puppeteer‑based PDF) ──
  const handleExport = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      // 1. Collect all stylesheet links and inline them
      const linkElements = Array.from(
        document.querySelectorAll("link[rel='stylesheet']")
      ) as HTMLLinkElement[];

      const inlineCssPromises = linkElements.map(async (link) => {
        try {
          const response = await fetch(link.href);
          if (response.ok) {
            const cssText = await response.text();
            return `<style>${cssText}</style>`;
          }
        } catch (e) {
          console.warn("Could not fetch stylesheet:", link.href);
        }
        return "";
      });

      const inlineCssBlocks = await Promise.all(inlineCssPromises);

      // 2. Keep any existing <style> tags
      const styleTags = Array.from(document.querySelectorAll("style"))
        .map((el) => el.outerHTML)
        .join("\n");

      const allCss = styleTags + "\n" + inlineCssBlocks.join("\n");

      // 3. Clone the preview
      const clone = previewRef.current.cloneNode(true) as HTMLElement;

      // 4. Fix width and shadow
      clone.style.maxWidth = "100%";
      clone.style.width = "100%";
      clone.style.boxSizing = "border-box";
      clone.style.boxShadow = "none";

      // 5. Replace icons
    

      // const icons = clone.querySelectorAll(".material-symbols-outlined");
      // icons.forEach((icon) => {
      //   const name = icon.textContent?.trim() || "";
      //   // const symbol = iconMapping[name] || name;
      //   // icon.textContent = symbol;
      //   (icon as HTMLElement).style.fontFamily = "sans-serif";
      //   (icon as HTMLElement).style.verticalAlign = "middle";
      //   (icon as HTMLElement).style.fontSize = "16px";
      //   (icon as HTMLElement).style.marginRight = "4px";
      // });

      // 6. Footer
      const footer = document.createElement("div");
      footer.textContent = "Generated by Pathway AI";
      footer.style.textAlign = "center";
      footer.style.fontSize = "8px";
      footer.style.color = "#999";
      footer.style.paddingTop = "16px";

      // 7. Wrapper for A4 aspect
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";
      wrapper.style.justifyContent = "space-between";
      wrapper.style.minHeight = "271.6mm";
      wrapper.style.boxSizing = "border-box";
      wrapper.appendChild(clone);
      wrapper.appendChild(footer);

      const previewHtml = wrapper.outerHTML;

      // 8. Full HTML document
      const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Resume - ${heading.name || "Untitled"}</title>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
          <style>
            .material-symbols-outlined {
              font-family: 'Material Symbols Outlined';
              font-weight: normal;
              font-style: normal;
              font-size: 18px;
              line-height: 1;
              letter-spacing: normal;
              text-transform: none;
              display: inline-block;
              white-space: nowrap;
              word-wrap: normal;
              direction: ltr;
              -webkit-font-smoothing: antialiased;
            }
            body {
              background: white !important;
              margin: 0;
              padding: 0;
            }
          </style>
          ${allCss}
        </head>
        <body style="margin:0; padding:0; background: white;">
          ${previewHtml}
        </body>
      </html>
    `;

      // 9. Send to server
      const response = await fetch("/api/resume-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: fullHtml }),
      });

      if (!response.ok) throw new Error("Server error");

      // 10. Download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${heading.name?.replace(/\s+/g, "_") || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    } finally {
      setExporting(false);
    }
  };

  // ── Memoised data extraction ──
  const { heading, summary, education, experience, skills, languages, certificates } =
    useMemo(
      () => ({
        heading: sections.find((s) => s.type === "heading")?.data || {},
        summary: sections.find((s) => s.type === "summary")?.data?.content || "",
        education: sections.find((s) => s.type === "education")?.data?.items || [],
        experience: sections.find((s) => s.type === "experience")?.data?.items || [],
        skills: sections.find((s) => s.type === "skills")?.data?.items || [],
        languages: sections.find((s) => s.type === "languages")?.data?.items || [],
        certificates: sections.find((s) => s.type === "certificates")?.data?.items || [],
      }),
      [sections]
    );

  // ─── Resume Editor Component ───
  function ResumeEditor({
    sections,
    updateSection,
    addItemToSection,
    removeItemFromSection,
    updateItemInSection,
  }: any) {
    // Local input component to prevent scroll jumps
    function LocalInput({ value, placeholder, onChange, ...rest }: any) {
      const [localValue, setLocalValue] = useState(value);
      const inputRef = useRef<HTMLInputElement>(null);

      useEffect(() => {
        setLocalValue(value);
      }, [value]);

      return (
        <input
          ref={inputRef}
          className="w-full p-2 border border-outline-variant rounded text-sm"
          placeholder={placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => {
            if (localValue !== value) {
              onChange(localValue);
            }
          }}
          {...rest}
        />
      );
    }

    function LocalTextarea({ value, placeholder, onChange, ...rest }: any) {
      const [localValue, setLocalValue] = useState(value);

      useEffect(() => {
        setLocalValue(value);
      }, [value]);

      return (
        <textarea
          className="w-full p-2 border border-outline-variant rounded text-sm min-h-[80px]"
          placeholder={placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => {
            if (localValue !== value) {
              onChange(localValue);
            }
          }}
          {...rest}
        />
      );
    }

    return (
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-on-surface">Edit Sections</h2>
        {sections.map((section: any, idx: number) => (
          <div key={idx} className="border border-outline-variant/20 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-on-surface capitalize">
                {section.type}
              </h3>
              {(section.type === "education" ||
                section.type === "experience" ||
                section.type === "certificates") && (
                  <button
                    onClick={() =>
                      addItemToSection(
                        idx,
                        section.type === "education"
                          ? { school: "Name", degree: "Degree Name", dates: "20XX-20XX", description: "Write a brief summary..." }
                          : section.type === "experience"
                            ? { company: "Name", role: "Role", dates: "20XX-20XX", description: "Write a brief summary..." }
                            : { name: "Name", issued_by: "Issued By", date_issued: "Date" }
                      )
                    }
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    + Add
                  </button>
                )}
            </div>

            {/* Heading fields */}
            {section.type === "heading" && (
              <div className="space-y-2">
                {[
                  { field: "name", placeholder: "Name" },
                  { field: "title", placeholder: "Title" },
                  { field: "email", placeholder: "Email" },
                  { field: "phone", placeholder: "Phone" },
                  { field: "location", placeholder: "Location" },
                  { field: "links", placeholder: "e.g. LinkedIn, GitHub (comma separated)" },
                ].map(({ field, placeholder }) => (
                  <LocalInput
                    key={field}
                    placeholder={placeholder}
                    value={section.data[field] || ""}
                    onChange={(newVal: string) => updateSection(idx, field, newVal)}
                  />
                ))}
              </div>
            )}

            {/* Summary */}
            {section.type === "summary" && (
              <LocalTextarea
                className="min-h-[120px] w-full p-2 border border-outline-variant rounded text-sm"
                placeholder="Write your professional summary..."
                value={section.data.content || ""}
                onChange={(newVal: string) => updateSection(idx, "content", newVal)}
              />
            )}

            {/* Education items */}
            {section.type === "education" &&
              section.data.items?.map((item: any, i: number) => (
                <div key={i} className="border-t border-outline-variant/10 pt-3 mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold">Item {i + 1}</span>
                    <button
                      onClick={() => removeItemFromSection(idx, i)}
                      className="text-error text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  {[
                    { field: "school", placeholder: "School" },
                    { field: "degree", placeholder: "Degree" },
                    { field: "dates", placeholder: "Dates" },
                  ].map(({ field, placeholder }) => (
                    <LocalInput
                      key={field}
                      placeholder={placeholder}
                      value={item[field] || ""}
                      onChange={(newVal: string) =>
                        updateItemInSection(idx, i, field, newVal)
                      }
                    />
                  ))}
                  <LocalTextarea
                    placeholder="Description"
                    value={item.description || ""}
                    onChange={(newVal: string) =>
                      updateItemInSection(idx, i, "description", newVal)
                    }
                  />
                </div>
              ))}

            {/* Experience items */}
            {section.type === "experience" &&
              section.data.items?.map((item: any, i: number) => (
                <div key={i} className="border-t border-outline-variant/10 pt-3 mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold">Item {i + 1}</span>
                    <button
                      onClick={() => removeItemFromSection(idx, i)}
                      className="text-error text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  {[
                    { field: "company", placeholder: "Company" },
                    { field: "role", placeholder: "Role" },
                    { field: "dates", placeholder: "Dates" },
                  ].map(({ field, placeholder }) => (
                    <LocalInput
                      key={field}
                      placeholder={placeholder}
                      value={item[field] || ""}
                      onChange={(newVal: string) =>
                        updateItemInSection(idx, i, field, newVal)
                      }
                    />
                  ))}
                  <LocalTextarea
                    placeholder="Description"
                    value={item.description || ""}
                    onChange={(newVal: string) =>
                      updateItemInSection(idx, i, "description", newVal)
                    }
                  />
                </div>
              ))}

            {/* Skills */}
            {section.type === "skills" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {section.data.items.map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container-high rounded text-xs"
                    >
                      {skill}
                      <button
                        onClick={() => removeItemFromSection(idx, i)}
                        className="text-error material-symbols-outlined text-[16px]"
                      >
                        close
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  className="w-full p-2 border border-outline-variant rounded text-sm"
                  placeholder="Type skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      addItemToSection(idx, e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            )}

            {/* Target country */}
            {section.type === "target" && (
              <LocalInput
                placeholder="Target Country"
                value={section.data.country || ""}
                onChange={(newVal: string) => updateSection(idx, "country", newVal)}
              />
            )}

            {/* Languages */}
            {section.type === "languages" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {section.data.items.map((lang: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-surface-container-high rounded text-xs"
                    >
                      {lang}
                      <button
                        onClick={() => removeItemFromSection(idx, i)}
                        className="text-error material-symbols-outlined text-[16px]"
                      >
                        close
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  className="w-full p-2 border border-outline-variant rounded text-sm"
                  placeholder="Type language and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      addItemToSection(idx, e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            )}

            {/* Certificates */}
            {section.type === "certificates" &&
              section.data.items?.map((cert: any, i: number) => (
                <div key={i} className="border-t border-outline-variant/10 pt-3 mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold">Certificate {i + 1}</span>
                    <button
                      onClick={() => removeItemFromSection(idx, i)}
                      className="text-error text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  {[
                    { field: "name", placeholder: "Certificate name" },
                    { field: "issued_by", placeholder: "Issued by" },
                    { field: "date_issued", placeholder: "Date issued" },
                  ].map(({ field, placeholder }) => (
                    <LocalInput
                      key={field}
                      placeholder={placeholder}
                      value={cert[field] || ""}
                      onChange={(newVal: string) =>
                        updateItemInSection(idx, i, field, newVal)
                      }
                    />
                  ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  }

  // ── Loading state (combine profile and resume loading) ──
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // ── Render ──
  return (
    <RequireProfile
      profileComplete={profileComplete}
      missingFields={missingFields}
      message="Build a professional resume by first completing your profile details."
    >
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .mobile-slide-in {
          animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (min-width: 1024px) {
          .mobile-slide-in {
            animation: none;
          }
        }
      `}</style>

      <main className="min-h-screen flex flex-col bg-surface-container overflow-hidden">
        {/* Toolbar */}
        <div className="no-print w-full px-4 sm:px-8 py-3 flex flex-wrap gap-2 justify-between items-center bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/10">
          <h2 className="font-headline-md text-body-lg text-on-surface font-semibold truncate max-w-[50%] sm:max-w-none">
            {heading.name || "Untitled"}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {saving && (
              <span className="text-xs hidden sm:block text-on-surface-variant animate-pulse">
                Saving…
              </span>
            )}
            <button
              onClick={() => setEditOpen(!editOpen)}
              className="cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-primary text-primary rounded-full font-label-md hover:bg-primary/5 transition-all"
            >
              {editOpen ? "Close Editor" : "Edit Details"}
            </button>
            <button
              onClick={() => handleGenerateFromProfile(false)}
              disabled={generating}
              className="cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-primary text-primary rounded-full font-label-md hover:bg-primary/5 transition-all"
            >
              {generating ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>

        {/* Main area */}
        <div className="grow flex overflow-hidden relative">
          {/* Side panel (editor) */}
          {editOpen && (
            <div className="no-print mobile-slide-in
              fixed inset-0 z-50 lg:static lg:z-auto
              w-full lg:w-[400px]
              overflow-y-auto p-4 sm:p-6
              bg-surface-container-lowest lg:border-r border-outline-variant/20
              custom-scrollbar space-y-8"
            >
              {/* Mobile close bar */}
              <div className="flex justify-between items-center lg:hidden mb-2">
                <span className="text-sm font-semibold text-on-surface">Edit Resume</span>
                <button
                  onClick={() => setEditOpen(false)}
                  className="material-symbols-outlined text-on-surface-variant"
                >
                  close
                </button>
              </div>
              <ResumeEditor
                sections={sections}
                updateSection={updateSection}
                addItemToSection={addItemToSection}
                removeItemFromSection={removeItemFromSection}
                updateItemInSection={updateItemInSection}
              />
            </div>
          )}

          {/* Live preview */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center py-6 sm:py-12 px-2 sm:px-4 bg-surface-container">
            <div className="w-full max-w-[850px] bg-white resume-preview-shadow p-4 sm:p-8 md:p-12 lg:p-16">
              {/* Heading */}
              <div ref={previewRef} className="bg-white">
                <div className="border-b-4 border-primary pb-4 sm:pb-8 mb-6 sm:mb-10">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">
                    {heading.name}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-secondary font-medium mt-2">
                    {heading.title}
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 sm:mt-6 text-[11px] sm:text-[13px] text-on-surface-variant">
                    <span className="flex items-center gap-2">
                      
                      {heading.email}
                    </span>
                    <span className="flex items-center gap-2">
                      {heading.phone}
                    </span>
                    <span className="flex items-center gap-2">
                      {heading.location}
                    </span>
                    {heading.links && heading.links.split(',').map((link: string, i: number) => {
                      const trimmed = link.trim();
                      if (!trimmed) return null;
                      return (
                        <span key={i} className="flex items-center gap-2">
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Body grid: single col on mobile, 2-col on sm+ */}
                <style>{`@media (min-width: 560px) { .resume-body-grid { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) !important; } }`}</style>
                <div className="resume-body-grid grid gap-6 sm:gap-12">
                  {/* Left column */}
                  <div className="space-y-10">
                    {/* Summary */}
                    <div>
                      <h3 className="text-[11px] font-bold text-primary tracking-widest uppercase mb-4 border-b border-outline-variant/20 pb-1">
                        Professional Summary
                      </h3>
                      <div
                        className="text-[14px] leading-relaxed text-on-surface-variant whitespace-pre-line"
                        style={{ wordBreak: "break-word" }}
                      >
                        {summary}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-[11px] font-bold text-primary tracking-widest uppercase mb-4 border-b border-outline-variant/20 pb-1">
                        Education
                      </h3>
                      <div className="space-y-6">
                        {education.map((edu: any, idx: number) => (
                          <div key={idx}>
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-[14px]">{edu.school}</p>
                              <p className="text-[11px] text-on-surface-variant font-medium">
                                {edu.dates}
                              </p>
                            </div>
                            <p className="text-[14px] italic text-secondary">
                              {edu.degree}
                            </p>
                            <div
                              className="text-[12px] mt-2 text-on-surface-variant whitespace-pre-line"
                              style={{ wordBreak: "break-word" }}
                            >
                              {edu.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <h3 className="text-[11px] font-bold text-primary tracking-widest uppercase mb-4 border-b border-outline-variant/20 pb-1">
                        Work Experience
                      </h3>
                      <div className="space-y-6">
                        {experience.map((exp: any, idx: number) => (
                          <div key={idx}>
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-[14px]">{exp.company}</p>
                              <p className="text-[11px] text-on-surface-variant font-medium">
                                {exp.dates}
                              </p>
                            </div>
                            <p className="text-[14px] italic text-secondary">
                              {exp.role}
                            </p>
                            <div
                              className="text-[12px] mt-2 text-on-surface-variant whitespace-pre-line"
                              style={{ wordBreak: "break-word" }}
                            >
                              {exp.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="space-y-10">
                    {/* Skills */}
                    <div>
                      <h3 className="text-[11px] font-bold text-primary tracking-widest uppercase mb-4 border-b border-outline-variant/20 pb-1">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-surface-container-high rounded text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="text-[11px] font-bold text-primary tracking-widest uppercase mb-4 border-b border-outline-variant/20 pb-1">
                        Languages
                      </h3>
                      {languages.map((lang: string, idx: number) => (
                        <p key={idx} className="text-[12px] text-on-surface-variant">
                          {lang}
                        </p>
                      ))}
                    </div>

                    {/* Certificates */}
                    <div>
                      <h3 className="text-[11px] font-bold text-primary tracking-widest uppercase mb-4 border-b border-outline-variant/20 pb-1">
                        Certifications
                      </h3>
                      {certificates.map((cert: any, idx: number) => (
                        <div key={idx} className="text-[12px] mb-2">
                          <p className="font-semibold">{cert.name}</p>
                          {cert.issued_by && (
                            <p className="text-on-surface-variant text-[11px]">
                              {cert.issued_by}
                              {cert.date_issued ? ` | ${cert.date_issued}` : ""}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Export Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 cursor-pointer px-4 sm:px-6 py-3 sm:py-4 bg-primary text-on-primary rounded-full font-label-lg flex items-center gap-2 shadow-xl shadow-primary/30 hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all"
        >
          {exporting ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Exporting…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export PDF
            </>
          )}
        </button>
      </main>
    </RequireProfile>
  );
}