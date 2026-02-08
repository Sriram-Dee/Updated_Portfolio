import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import toast from "react-hot-toast";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderKanban,
  Settings,
  LogOut,
  Save,
  Menu,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
  EyeOff,
  Palette,
  Code2,
} from "lucide-react";

import { Button, Input, Textarea, Modal, Badge } from "@/components/ui";
import { GradientText, SpotlightCard } from "@/components/effects";
import { cn, generateId } from "@/utils/helpers";

// Sidebar Navigation Items
const navItems = [
  { id: "theme", label: "Theme", icon: Palette },
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "settings", label: "Site Settings", icon: Settings },
];

// Image Upload Component
// Image Upload Component
const ImageUploader = ({
  value,
  onChange,
  onFileSelect,
  label,
  className,
  onPreview,
}) => {
  const [preview, setPreview] = useState(value);
  // Stable ID for the input
  const [uniqueId] = useState(
    () => `file-upload-${Math.random().toString(36).substr(2, 9)}`,
  );

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Notify parent to queue upload
    if (onFileSelect) {
      onFileSelect(file, objectUrl);
    }

    // Update parent value with local URL (for preview)
    onChange(objectUrl);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface border border-border group">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className={cn(
                "w-full h-full object-cover",
                onPreview && "cursor-pointer hover:opacity-80 transition",
              )}
              onClick={() => onPreview && onPreview(preview)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <Upload size={24} />
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only" // Use sr-only for better accessibility/behavior than hidden
            id={uniqueId}
          />
          <label htmlFor={uniqueId} className="cursor-pointer inline-block">
            <Button
              variant="outline"
              size="sm"
              as="span"
              className="pointer-events-none" // Prevent button from capturing click, let label handle it
            >
              {value ? "Change" : "Upload"}
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
};

// Section Card Component
const SectionCard = ({ title, children, actions }) => (
  <SpotlightCard className="glass p-6 mb-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold">{title}</h3>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </SpotlightCard>
);

// EntryCard with Visibility Toggle
const EntryCard = ({
  children,
  onDelete,
  onToggle,
  enabled = true,
  className,
}) => (
  <div
    className={cn(
      "bg-surface/50 rounded-xl p-4 border border-border relative group transition-all duration-300",
      !enabled && "opacity-60 grayscale-[0.5]",
      className,
    )}
  >
    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      {onToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            enabled
              ? "bg-surface text-text-secondary hover:text-primary hover:bg-surface-elevated"
              : "bg-surface text-text-muted hover:text-text-secondary hover:bg-surface-elevated",
          )}
          title={enabled ? "Hide" : "Show"}
        >
          {enabled ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      )}
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
    {children}
  </div>
);

// Theme Tab
const ThemeTab = ({ data, onChange }) => {
  if (!data) return null;

  const handleChange = (key, value) => {
    onChange({ ...data, [key]: value });
    // Live preview
    document.documentElement.style.setProperty(`--color-${key}`, value);
  };

  const colors = [
    { key: "primary", label: "Primary Background" },
    { key: "secondary", label: "Secondary Background" },
    { key: "accent", label: "Primary Accent" },
    { key: "accent-secondary", label: "Secondary Accent (Teal)" },
    { key: "accent-tertiary", label: "Tertiary Accent (Pink)" },
    { key: "text-primary", label: "Primary Text" },
    { key: "text-secondary", label: "Secondary Text" },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Site Theme">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colors.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-4">
              <input
                type="color"
                value={data[key] || "#000000"}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {label}
                </label>
                <Input
                  value={data[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder="#000000"
                  className="mt-0"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
      <div className="bg-surface/50 p-4 rounded-xl border border-border text-sm text-text-secondary">
        <p>Tip: Changes are previewed live but must be SAVED to persist.</p>
      </div>
    </div>
  );
};
const ProfileTab = ({ data, onChange, onPreview }) => {
  if (!data) return null;

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Profile Image">
        <ImageUploader
          value={data.avatar}
          onChange={(url) => handleChange("avatar", url)}
          onFileSelect={onPreview} // passing onFileSelect logic via props
          onPreview={
            onPreview && typeof onPreview === "function" ? onPreview : undefined
          }
          label="Avatar"
        />
      </SectionCard>

      <SectionCard title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={data.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            label="Title"
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g., Full Stack Developer"
          />
          <Input
            label="Email"
            type="email"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            label="Location"
            value={data.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Professional Summary">
        <Textarea
          value={data.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Write a compelling summary about yourself..."
        />
      </SectionCard>

      <SectionCard title="Social Links">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="GitHub"
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/username"
          />
          <Input
            label="LinkedIn"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
          <Input
            label="Twitter"
            value={data.twitter || ""}
            onChange={(e) => handleChange("twitter", e.target.value)}
            placeholder="https://twitter.com/username"
          />
          <Input
            label="Website"
            value={data.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </SectionCard>
    </div>
  );
};

// Skills Tab
const SkillsTab = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const addSkill = (category) => {
    if (!newSkill.trim()) return;
    const updated = { ...data };
    if (!updated[category]) updated[category] = [];
    // Store as object { name, enabled }
    updated[category] = [
      ...updated[category],
      { name: newSkill.trim(), enabled: true },
    ];
    onChange(updated);
    setNewSkill("");
  };

  const removeSkill = (category, index) => {
    const updated = { ...data };
    updated[category] = updated[category].filter((_, i) => i !== index);
    if (updated[category].length === 0) delete updated[category];
    onChange(updated);
  };

  const toggleSkill = (category, index) => {
    const updated = { ...data };
    const skill = updated[category][index];
    // Handle both legacy strings and new objects
    if (typeof skill === "string") {
      updated[category][index] = { name: skill, enabled: false };
    } else {
      updated[category][index] = { ...skill, enabled: !skill.enabled };
    }
    onChange(updated);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    const categoryKey = newCategory.toLowerCase().trim();
    if (data[categoryKey]) {
      toast.error("Category already exists");
      return;
    }
    onChange({ ...data, [categoryKey]: [] });
    setNewCategory("");
    toast.success("Category added");
  };

  return (
    <div className="space-y-6">
      {/* Add Category */}
      <SectionCard title="Add Category">
        <div className="flex gap-3">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g., Tools, Languages..."
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
          />
          <Button onClick={addCategory}>
            <Plus size={18} />
            Add
          </Button>
        </div>
      </SectionCard>

      {/* Skill Categories */}
      {Object.entries(data || {}).map(([category, skills]) => (
        <SectionCard
          key={category}
          title={<span className="capitalize">{category} Skills</span>}
        >
          {/* Current Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skillItem, index) => {
              const name =
                typeof skillItem === "string" ? skillItem : skillItem.name;
              const enabled =
                typeof skillItem === "string" ? true : skillItem.enabled;

              return (
                <Badge
                  key={index}
                  variant={enabled ? "accent" : "outline"}
                  className={cn(
                    "flex items-center gap-2 pr-2 transition-all",
                    !enabled && "opacity-60 bg-surface border-dashed",
                  )}
                >
                  {name}
                  <div className="flex items-center gap-1 ml-1 border-l border-white/10 pl-2">
                    <button
                      onClick={() => toggleSkill(category, index)}
                      className={cn(
                        "hover:bg-white/10 rounded p-0.5 transition-colors",
                        enabled ? "text-white/70" : "text-text-muted",
                      )}
                      title={enabled ? "Disable" : "Enable"}
                    >
                      {enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button
                      onClick={() => removeSkill(category, index)}
                      className="text-error/70 hover:text-error hover:bg-error/10 rounded p-0.5 transition-colors"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </Badge>
              );
            })}
            {skills.length === 0 && (
              <p className="text-text-muted text-sm">No skills added yet</p>
            )}
          </div>

          {/* Add Skill */}
          <div className="flex gap-3">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder={`Add ${category} skill...`}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && addSkill(category)}
            />
            <Button variant="outline" onClick={() => addSkill(category)}>
              <Plus size={18} />
            </Button>
          </div>
        </SectionCard>
      ))}
    </div>
  );
};

// Experience Tab
const ExperienceTab = ({ data, onChange }) => {
  const addEntry = () => {
    onChange([
      ...(data || []),
      {
        id: generateId(),
        role: "",
        company: "",
        location: "",
        period: "",
        description: "",
        technologies: "",
      },
    ]);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEntry = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const toggleEntry = (index) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      enabled: updated[index].enabled === false ? true : false,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addEntry}>
          <Plus size={18} />
          Add Experience
        </Button>
      </div>

      {(data || []).map((exp, index) => (
        <EntryCard
          key={exp.id || index}
          onDelete={() => removeEntry(index)}
          onToggle={() => toggleEntry(index)}
          enabled={exp.enabled !== false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Role/Title"
              value={exp.role}
              onChange={(e) => updateEntry(index, "role", e.target.value)}
            />
            <Input
              label="Company"
              value={exp.company}
              onChange={(e) => updateEntry(index, "company", e.target.value)}
            />
            <Input
              label="Location"
              value={exp.location}
              onChange={(e) => updateEntry(index, "location", e.target.value)}
            />
            <Input
              label="Period"
              value={exp.period}
              onChange={(e) => updateEntry(index, "period", e.target.value)}
              placeholder="e.g., Jan 2022 - Present"
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              value={exp.description}
              onChange={(e) =>
                updateEntry(index, "description", e.target.value)
              }
              placeholder="Description (separate points with new lines)"
              rows={5}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Technologies (comma separated)"
              value={exp.technologies}
              onChange={(e) =>
                updateEntry(index, "technologies", e.target.value)
              }
              placeholder="React, Node.js, MongoDB..."
            />
          </div>
        </EntryCard>
      ))}

      {(!data || data.length === 0) && (
        <div className="text-center py-12 text-text-muted">
          <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
          <p>No experience entries yet</p>
          <Button variant="outline" className="mt-4" onClick={addEntry}>
            Add Your First Experience
          </Button>
        </div>
      )}
    </div>
  );
};

// Projects Tab
const ProjectsTab = ({ data, onChange, onPreview, onFileSelect }) => {
  const addEntry = () => {
    onChange([
      ...(data || []),
      {
        id: generateId(),
        name: "",
        description: "",
        technologies: "",
        images: [],
        demoUrl: "",
        github: "",
      },
    ]);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEntry = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const addImage = (index, files) => {
    // Handle both single file and FileList/Array
    const fileList = files instanceof FileList ? Array.from(files) : [files];
    const objectUrls = fileList.map((file) => URL.createObjectURL(file));

    const updated = [...data];
    updated[index].images = [...(updated[index].images || []), ...objectUrls];
    onChange(updated);

    if (onFileSelect) {
      fileList.forEach((file, i) => {
        onFileSelect(file, objectUrls[i]);
      });
    }
  };

  const removeImage = (projectIndex, imageIndex) => {
    const updated = [...data];
    updated[projectIndex].images = updated[projectIndex].images.filter(
      (_, i) => i !== imageIndex,
    );
    onChange(updated);
  };

  const handleMoveImage = (projectIndex, imageIndex, direction) => {
    const project = data[projectIndex];
    const images = [...(project.images || [])];

    if (direction === "left" && imageIndex > 0) {
      [images[imageIndex], images[imageIndex - 1]] = [
        images[imageIndex - 1],
        images[imageIndex],
      ];
    } else if (direction === "right" && imageIndex < images.length - 1) {
      [images[imageIndex], images[imageIndex + 1]] = [
        images[imageIndex + 1],
        images[imageIndex],
      ];
    }

    updateEntry(projectIndex, "images", images);
  };

  const toggleEntry = (index) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      enabled: updated[index].enabled === false ? true : false,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addEntry}>
          <Plus size={18} />
          Add Project
        </Button>
      </div>

      {(data || []).map((project, index) => (
        <EntryCard
          key={project.id || index}
          onDelete={() => removeEntry(index)}
          onToggle={() => toggleEntry(index)}
          enabled={project.enabled !== false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Name"
              value={project.name}
              onChange={(e) => updateEntry(index, "name", e.target.value)}
            />
            <Input
              label="Technologies"
              value={project.technologies}
              onChange={(e) =>
                updateEntry(index, "technologies", e.target.value)
              }
              placeholder="React, Firebase..."
            />
            <Input
              label="Live URL"
              value={project.demoUrl}
              onChange={(e) => updateEntry(index, "demoUrl", e.target.value)}
            />
            <Input
              label="GitHub URL"
              value={project.github}
              onChange={(e) => updateEntry(index, "github", e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              value={project.description}
              onChange={(e) =>
                updateEntry(index, "description", e.target.value)
              }
              rows={3}
            />
          </div>

          {/* Project Images */}
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Project Images
          </label>
          <div className="w-full max-w-[85vw] md:max-w-full">
            <div className="flex bg-black/20 p-3 rounded-xl overflow-x-auto gap-3 pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent w-full">
              {(project.images || []).map((img, imgIndex) => (
                <div
                  key={img}
                  className="relative group shrink-0 w-32 h-32 md:w-36 md:h-36"
                >
                  <div
                    className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 bg-black/40 cursor-pointer"
                    onClick={() => onPreview && onPreview(img)}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Controls Overlay - Glassmorphic Bottom Bar */}
                    <div className="absolute inset-x-0 bottom-0 p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex items-center justify-between gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10">
                        {/* Move Left */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveImage(index, imgIndex, "left");
                          }}
                          disabled={imgIndex === 0}
                          className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
                          title="Move Left"
                        >
                          <ChevronLeft size={14} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index, imgIndex);
                          }}
                          className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Move Right */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveImage(index, imgIndex, "right");
                          }}
                          disabled={
                            imgIndex === (project.images?.length || 0) - 1
                          }
                          className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
                          title="Move Right"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Index Badge */}
                  <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-surface-elevated border border-border text-[9px] font-bold flex items-center justify-center text-text-secondary shadow-sm z-20">
                    {imgIndex + 1}
                  </div>
                </div>
              ))}

              {/* Modern Add Button */}
              <label className="w-32 h-32 md:w-36 md:h-36 relative group cursor-pointer shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.length && addImage(index, e.target.files)
                  }
                />
                <div className="absolute inset-0 rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] group-hover:bg-white/[0.05] group-hover:border-accent/40 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-text-muted group-hover:text-accent">
                  <div className="p-2 rounded-full bg-white/5 group-hover:bg-accent/10 transition-colors">
                    <Plus size={20} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-medium">
                    Add Image
                  </span>
                </div>
              </label>
            </div>
          </div>
        </EntryCard>
      ))}

      {(!data || data.length === 0) && (
        <div className="text-center py-12 text-text-muted">
          <FolderKanban size={48} className="mx-auto mb-4 opacity-50" />
          <p>No projects yet</p>
          <Button variant="outline" className="mt-4" onClick={addEntry}>
            Add Your First Project
          </Button>
        </div>
      )}
    </div>
  );
};

// Education Tab
const EducationTab = ({ data, onChange, onPreview, onFileSelect }) => {
  const addEntry = () => {
    onChange([
      ...(data || []),
      {
        id: generateId(),
        degree: "",
        institution: "",
        period: "",
        description: "",
        logo: "",
      },
    ]);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEntry = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const toggleEntry = (index) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      enabled: updated[index].enabled === false ? true : false,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addEntry}>
          <Plus size={18} />
          Add Education
        </Button>
      </div>

      {(data || []).map((edu, index) => (
        <EntryCard
          key={edu.id || index}
          onDelete={() => removeEntry(index)}
          onToggle={() => toggleEntry(index)}
          enabled={edu.enabled !== false}
        >
          <div className="flex gap-4 mb-4">
            <ImageUploader
              value={edu.logo}
              onChange={(url) => updateEntry(index, "logo", url)}
              onFileSelect={onFileSelect}
              onPreview={onPreview}
              label="Logo"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Degree"
              value={edu.degree}
              onChange={(e) => updateEntry(index, "degree", e.target.value)}
            />
            <Input
              label="Institution"
              value={edu.institution}
              onChange={(e) =>
                updateEntry(index, "institution", e.target.value)
              }
            />
            <Input
              label="Period"
              value={edu.period}
              onChange={(e) => updateEntry(index, "period", e.target.value)}
              placeholder="e.g., 2018 - 2022"
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description (optional)"
              value={edu.description}
              onChange={(e) =>
                updateEntry(index, "description", e.target.value)
              }
              placeholder="Description (separate points with new lines)"
              rows={4}
            />
          </div>
        </EntryCard>
      ))}

      {(!data || data.length === 0) && (
        <div className="text-center py-12 text-text-muted">
          <GraduationCap size={48} className="mx-auto mb-4 opacity-50" />
          <p>No education entries yet</p>
          <Button variant="outline" className="mt-4" onClick={addEntry}>
            Add Your Education
          </Button>
        </div>
      )}
    </div>
  );
};

// Achievements Tab
const AchievementsTab = ({ data, onChange, onPreview, onFileSelect }) => {
  const addEntry = () => {
    onChange([
      ...(data || []),
      {
        id: generateId(),
        name: "",
        issuer: "",
        date: "",
        description: "",
        image: "",
        link: "",
      },
    ]);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEntry = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const toggleEntry = (index) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      enabled: updated[index].enabled === false ? true : false,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addEntry}>
          <Plus size={18} />
          Add Achievement
        </Button>
      </div>

      {(data || []).map((achievement, index) => (
        <EntryCard
          key={achievement.id || index}
          onDelete={() => removeEntry(index)}
          onToggle={() => toggleEntry(index)}
          enabled={achievement.enabled !== false}
        >
          <div className="flex gap-4 mb-4">
            <ImageUploader
              value={achievement.image}
              onChange={(url) => updateEntry(index, "image", url)}
              onFileSelect={onFileSelect}
              onPreview={onPreview}
              label="Certificate Image"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={achievement.name}
              onChange={(e) => updateEntry(index, "name", e.target.value)}
            />
            <Input
              label="Issuer"
              value={achievement.issuer}
              onChange={(e) => updateEntry(index, "issuer", e.target.value)}
            />
            <Input
              label="Date"
              value={achievement.date}
              onChange={(e) => updateEntry(index, "date", e.target.value)}
              placeholder="e.g., January 2023"
            />
            <Input
              label="Certificate Link"
              value={achievement.link || ""}
              onChange={(e) => updateEntry(index, "link", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description (optional)"
              value={achievement.description}
              onChange={(e) =>
                updateEntry(index, "description", e.target.value)
              }
              placeholder="Description (separate points with new lines)"
              rows={4}
            />
          </div>
        </EntryCard>
      ))}

      {(!data || data.length === 0) && (
        <div className="text-center py-12 text-text-muted">
          <Award size={48} className="mx-auto mb-4 opacity-50" />
          <p>No achievements yet</p>
          <Button variant="outline" className="mt-4" onClick={addEntry}>
            Add Your First Achievement
          </Button>
        </div>
      )}
    </div>
  );
};

// Settings Tab (Section Visibility)
const SettingsTab = ({ data, onChange }) => {
  const sections = [
    { id: "hero", label: "Hero Section" },
    { id: "skills", label: "Skills Section" },
    { id: "experience", label: "Experience Section" },
    { id: "projects", label: "Projects Section" },
    { id: "education", label: "Education Section" },
    { id: "achievements", label: "Achievements Section" },
    { id: "contact", label: "Contact Section" },
  ];

  const handleToggle = (sectionId) => {
    const currentSettings = data.sections || {};
    onChange({
      ...data,
      sections: {
        ...currentSettings,
        [sectionId]: currentSettings[sectionId] === false ? true : false,
      },
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Section Visibility">
        <p className="text-text-secondary mb-4">
          Toggle which sections are visible on your portfolio.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map(({ id, label }) => {
            const isVisible = data?.sections?.[id] !== false;
            return (
              <div
                key={id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                  isVisible
                    ? "bg-surface border-white/10"
                    : "bg-surface/30 border-white/5 opacity-60",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isVisible ? "bg-accent-secondary" : "bg-text-muted",
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium",
                      isVisible ? "text-text-primary" : "text-text-secondary",
                    )}
                  >
                    {label}
                  </span>
                </div>
                <button
                  onClick={() => handleToggle(id)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isVisible
                      ? "bg-accent/10 text-accent hover:bg-accent/20"
                      : "bg-black/20 text-text-muted hover:bg-black/30",
                  )}
                >
                  {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

// Main Admin Component
const Admin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Set default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get("/api/portfolio");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // Create a ref to store pending uploads (blob URL -> File)
  const pendingUploads = useRef(new Map());

  // Handle file selection (queueing uploads)
  const handleFileSelect = (file, blobUrl) => {
    pendingUploads.current.set(blobUrl, file);
    setIsDirty(true);
  };

  // Allow clearing pending uploads when data is refreshed or component unmounts
  useEffect(() => {
    return () => {
      pendingUploads.current.clear();
    };
  }, []);

  const processUploads = async (obj) => {
    // If string is a blob URL, upload it
    if (typeof obj === "string" && obj.startsWith("blob:")) {
      if (pendingUploads.current.has(obj)) {
        const file = pendingUploads.current.get(obj);
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          return response.data.url;
        } catch (error) {
          console.error("Upload failed for", obj, error);
          toast.error("One or more images failed to upload");
          return obj; // Return original on failure
        }
      }
    }

    // Recursively process arrays
    if (Array.isArray(obj)) {
      return Promise.all(obj.map(processUploads));
    }

    // Recursively process objects
    if (typeof obj === "object" && obj !== null) {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = await processUploads(obj[key]);
      }
      return newObj;
    }

    return obj;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Process any pending uploads
      const processedData = await processUploads(data);

      await axios.post("/api/portfolio", processedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Update local state with processed URLs (no more blob URLs)
      setData(processedData);
      pendingUploads.current.clear();

      toast.success("Changes saved successfully!");
      setIsDirty(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setSaving(false);
    }
  };

  const updateData = (section, value) => {
    setData((prev) => ({ ...prev, [section]: value }));
    setIsDirty(true);
  };

  const handleTabChange = (newTab) => {
    if (activeTab === newTab) return;

    if (isDirty) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to switch tabs without saving?",
        )
      ) {
        return;
      }
    }

    setActiveTab(newTab);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-secondary/20 border-t-accent-secondary rounded-full animate-spin" />
      </div>
    );
  }

  const renderTab = () => {
    const commonProps = {
      onPreview: setPreviewImage,
      onFileSelect: handleFileSelect,
    };

    switch (activeTab) {
      case "theme":
        return (
          <ThemeTab
            data={data?.theme || {}}
            onChange={(v) => updateData("theme", v)}
          />
        );
      case "profile":
        return (
          <ProfileTab
            data={data?.profile}
            onChange={(v) => updateData("profile", v)}
            {...commonProps}
          />
        );
      case "skills":
        return (
          <SkillsTab
            data={data?.skills}
            onChange={(v) => updateData("skills", v)}
            {...commonProps}
          />
        );
      case "experience":
        return (
          <ExperienceTab
            data={data?.experience}
            onChange={(v) => updateData("experience", v)}
            {...commonProps}
          />
        );
      case "projects":
        return (
          <ProjectsTab
            data={data?.projects}
            onChange={(v) => updateData("projects", v)}
            {...commonProps}
          />
        );
      case "education":
        return (
          <EducationTab
            data={data?.education}
            onChange={(v) => updateData("education", v)}
            {...commonProps}
          />
        );
      case "achievements":
        return (
          <AchievementsTab
            data={data?.achievements}
            onChange={(v) => updateData("achievements", v)}
            {...commonProps}
          />
        );
      case "settings":
        return (
          <SettingsTab
            data={data?.settings || {}}
            onChange={(v) => updateData("settings", v)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 glass border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-surface transition"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-bold font-heading">
              <GradientText>Admin</GradientText>
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={handleSave}
              loading={saving}
              disabled={!isDirty}
            >
              <Save size={16} />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 glass border-r border-border",
            "transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-bold font-heading">
              <GradientText from="text-secondary" to="accent-secondary">
                Dashboard
              </GradientText>
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition",
                    activeTab === item.id
                      ? "bg-accent-secondary/20 text-accent-secondary"
                      : "text-text-secondary hover:text-white hover:bg-surface",
                  )}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="flex gap-2">
              <a href="/" target="_blank" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye size={16} />
                  Preview
                </Button>
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-error"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between py-4 px-8 border-b border-border sticky top-0 z-[500] bg-primary/80 backdrop-blur-md">
            <div>
              <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
              <p className="text-text-secondary text-sm mt-1">
                Manage your {activeTab} information
              </p>
            </div>
            <div className="flex gap-3">
              <a href="/" target="_blank">
                <Button variant="outline">
                  <Eye size={18} />
                  Preview Site
                </Button>
              </a>
              <Button onClick={handleSave} loading={saving} disabled={!isDirty}>
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full min-w-0"
                >
                  {renderTab()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
